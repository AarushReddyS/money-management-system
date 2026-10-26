package com.moneymanager.service;

import com.moneymanager.dto.*;
import com.moneymanager.entity.BudgetCategory;
import com.moneymanager.entity.MonthlyBudget;
import com.moneymanager.entity.User;
import com.moneymanager.enums.ExpenseCategory;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.repository.MonthlyBudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private MonthlyBudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Transactional
    public BudgetResponse createOrUpdateBudget(User user, BudgetRequest request) {
        Optional<MonthlyBudget> existing = budgetRepository.findByUserAndYearAndMonth(user, request.getYear(), request.getMonth());

        MonthlyBudget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setTotalBudget(request.getTotalBudget());
            budget.setNotes(request.getNotes());
            budget.clearCategories();
        } else {
            budget = new MonthlyBudget(user, request.getYear(), request.getMonth(), request.getTotalBudget(), request.getNotes());
        }

        if (request.getCategories() != null) {
            for (CategoryBudgetDto catDto : request.getCategories()) {
                budget.addCategory(new BudgetCategory(catDto.getCategory(), catDto.getAllocatedAmount()));
            }
        }

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    public BudgetResponse getBudget(User user, Integer year, Integer month) {
        MonthlyBudget budget = budgetRepository.findByUserAndYearAndMonth(user, year, month)
                .orElseThrow(() -> new ResourceNotFoundException("No budget set for " + month + "/" + year));

        return mapToResponse(budget);
    }

    public List<BudgetResponse> getAllBudgets(User user) {
        return budgetRepository.findByUserOrderByYearDescMonthDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBudget(User user, Long id) {
        MonthlyBudget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        budgetRepository.delete(budget);
    }

    public BudgetComparisonDto getBudgetComparison(User user, Integer year, Integer month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        Optional<MonthlyBudget> budgetOpt = budgetRepository.findByUserAndYearAndMonth(user, year, month);
        BigDecimal totalBudget = budgetOpt.map(MonthlyBudget::getTotalBudget).orElse(BigDecimal.ZERO);

        BigDecimal totalSpent = expenseRepository.sumByUserAndDateBetween(user, startDate, endDate);
        if (totalSpent == null) {
            totalSpent = BigDecimal.ZERO;
        }

        BigDecimal remainingBudget = totalBudget.subtract(totalSpent);
        double percentageSpent = 0.0;
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            percentageSpent = totalSpent.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
        boolean isOverBudget = totalSpent.compareTo(totalBudget) > 0 && totalBudget.compareTo(BigDecimal.ZERO) > 0;

        // Group actual expenses by category
        List<Object[]> expenseBreakdown = expenseRepository.findCategoryBreakdownBetween(user, startDate, endDate);
        Map<ExpenseCategory, BigDecimal> actualMap = new HashMap<>();
        for (Object[] row : expenseBreakdown) {
            ExpenseCategory cat = (ExpenseCategory) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            actualMap.put(cat, amount);
        }

        // Map budgeted categories
        Map<ExpenseCategory, BigDecimal> budgetedMap = new HashMap<>();
        if (budgetOpt.isPresent()) {
            for (BudgetCategory bc : budgetOpt.get().getCategories()) {
                budgetedMap.put(bc.getCategory(), bc.getAllocatedAmount());
            }
        }

        // Combine all distinct categories
        Set<ExpenseCategory> allCategories = new LinkedHashSet<>(budgetedMap.keySet());
        allCategories.addAll(actualMap.keySet());

        List<BudgetComparisonDto.CategoryComparisonDto> catComparisons = new ArrayList<>();
        for (ExpenseCategory cat : allCategories) {
            BigDecimal allocated = budgetedMap.getOrDefault(cat, BigDecimal.ZERO);
            BigDecimal spent = actualMap.getOrDefault(cat, BigDecimal.ZERO);
            BigDecimal remaining = allocated.subtract(spent);

            double catPct = 0.0;
            if (allocated.compareTo(BigDecimal.ZERO) > 0) {
                catPct = spent.divide(allocated, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }

            boolean catOver = spent.compareTo(allocated) > 0 && allocated.compareTo(BigDecimal.ZERO) > 0;

            catComparisons.add(new BudgetComparisonDto.CategoryComparisonDto(
                    cat, allocated, spent, remaining, catPct, catOver
            ));
        }

        // Sort descending by spent amount
        catComparisons.sort((a, b) -> b.getSpentAmount().compareTo(a.getSpentAmount()));

        return new BudgetComparisonDto(
                year,
                month,
                totalBudget,
                totalSpent,
                remainingBudget,
                percentageSpent,
                isOverBudget,
                catComparisons
        );
    }

    public BudgetResponse mapToResponse(MonthlyBudget budget) {
        List<CategoryBudgetDto> catDtos = budget.getCategories().stream()
                .map(c -> new CategoryBudgetDto(c.getCategory(), c.getAllocatedAmount()))
                .collect(Collectors.toList());

        return new BudgetResponse(
                budget.getId(),
                budget.getYear(),
                budget.getMonth(),
                budget.getTotalBudget(),
                budget.getNotes(),
                catDtos,
                budget.getCreatedAt()
        );
    }
}

