package com.moneymanager.service;

import com.moneymanager.dto.CategoryBreakdownDto;
import com.moneymanager.dto.DashboardSummaryDto;
import com.moneymanager.dto.MonthlyTrendDto;
import com.moneymanager.entity.MonthlyBudget;
import com.moneymanager.entity.User;
import com.moneymanager.enums.BillStatus;
import com.moneymanager.enums.ExpenseCategory;
import com.moneymanager.enums.IncomeCategory;
import com.moneymanager.repository.BillRepository;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.repository.IncomeRepository;
import com.moneymanager.repository.MonthlyBudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MonthlyBudgetRepository budgetRepository;

    public DashboardSummaryDto getSummary(User user) {
        LocalDate today = LocalDate.now();
        YearMonth currentYm = YearMonth.from(today);
        LocalDate startOfMonth = currentYm.atDay(1);
        LocalDate endOfMonth = currentYm.atEndOfMonth();

        // Current Month Metrics
        BigDecimal monthlyIncome = incomeRepository.sumByUserAndDateBetween(user, startOfMonth, endOfMonth);
        if (monthlyIncome == null) monthlyIncome = BigDecimal.ZERO;

        BigDecimal monthlyExpense = expenseRepository.sumByUserAndDateBetween(user, startOfMonth, endOfMonth);
        if (monthlyExpense == null) monthlyExpense = BigDecimal.ZERO;

        BigDecimal monthlyNetSavings = monthlyIncome.subtract(monthlyExpense);

        double monthlySavingsRate = 0.0;
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            monthlySavingsRate = monthlyNetSavings.divide(monthlyIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // All Time Metrics
        BigDecimal totalIncomeAllTime = incomeRepository.sumTotalByUser(user);
        if (totalIncomeAllTime == null) totalIncomeAllTime = BigDecimal.ZERO;

        BigDecimal totalExpenseAllTime = expenseRepository.sumTotalByUser(user);
        if (totalExpenseAllTime == null) totalExpenseAllTime = BigDecimal.ZERO;

        BigDecimal netWorth = totalIncomeAllTime.subtract(totalExpenseAllTime);

        // Bills Metrics
        long pendingBillsCount = billRepository.countByUserAndStatus(user, BillStatus.PENDING);
        long overdueBillsCount = billRepository.countOverdueBills(user, today);
        BigDecimal pendingBillsAmount = billRepository.sumPendingBillsAmount(user);
        if (pendingBillsAmount == null) pendingBillsAmount = BigDecimal.ZERO;

        // Current Month Budget Metrics
        Optional<MonthlyBudget> currentBudget = budgetRepository.findByUserAndYearAndMonth(user, today.getYear(), today.getMonthValue());
        BigDecimal currentMonthBudget = currentBudget.map(MonthlyBudget::getTotalBudget).orElse(BigDecimal.ZERO);

        double budgetSpentPercentage = 0.0;
        boolean isBudgetExceeded = false;
        if (currentMonthBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetSpentPercentage = monthlyExpense.divide(currentMonthBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            isBudgetExceeded = monthlyExpense.compareTo(currentMonthBudget) > 0;
        }

        return new DashboardSummaryDto(
                monthlyIncome,
                monthlyExpense,
                monthlyNetSavings,
                monthlySavingsRate,
                totalIncomeAllTime,
                totalExpenseAllTime,
                netWorth,
                pendingBillsCount,
                pendingBillsAmount,
                overdueBillsCount,
                currentMonthBudget,
                budgetSpentPercentage,
                isBudgetExceeded
        );
    }

    public List<MonthlyTrendDto> getMonthlyTrends(User user, int months) {
        if (months <= 0) months = 6;
        YearMonth current = YearMonth.now();
        List<MonthlyTrendDto> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = months - 1; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumByUserAndDateBetween(user, start, end);
            if (inc == null) inc = BigDecimal.ZERO;

            BigDecimal exp = expenseRepository.sumByUserAndDateBetween(user, start, end);
            if (exp == null) exp = BigDecimal.ZERO;

            BigDecimal net = inc.subtract(exp);

            trends.add(new MonthlyTrendDto(
                    ym.getYear(),
                    ym.getMonthValue(),
                    ym.format(formatter),
                    inc,
                    exp,
                    net
            ));
        }

        return trends;
    }

    public List<CategoryBreakdownDto> getExpenseCategoryBreakdown(User user, Integer year, Integer month) {
        List<Object[]> rows;
        BigDecimal total;

        if (year != null && month != null) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            rows = expenseRepository.findCategoryBreakdownBetween(user, start, end);
            total = expenseRepository.sumByUserAndDateBetween(user, start, end);
        } else {
            rows = expenseRepository.findCategoryBreakdownAllTime(user);
            total = expenseRepository.sumTotalByUser(user);
        }

        if (total == null || total.compareTo(BigDecimal.ZERO) == 0) {
            return new ArrayList<>();
        }

        List<CategoryBreakdownDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            ExpenseCategory cat = (ExpenseCategory) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = ((Number) row[2]).longValue();

            double percentage = amount.divide(total, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            result.add(new CategoryBreakdownDto(cat.name(), amount, percentage, count));
        }

        result.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return result;
    }

    public List<CategoryBreakdownDto> getIncomeCategoryBreakdown(User user, Integer year, Integer month) {
        List<Object[]> rows;
        BigDecimal total;

        if (year != null && month != null) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            rows = incomeRepository.findCategoryBreakdownBetween(user, start, end);
            total = incomeRepository.sumByUserAndDateBetween(user, start, end);
        } else {
            rows = incomeRepository.findCategoryBreakdownAllTime(user);
            total = incomeRepository.sumTotalByUser(user);
        }

        if (total == null || total.compareTo(BigDecimal.ZERO) == 0) {
            return new ArrayList<>();
        }

        List<CategoryBreakdownDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            IncomeCategory cat = (IncomeCategory) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = ((Number) row[2]).longValue();

            double percentage = amount.divide(total, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            result.add(new CategoryBreakdownDto(cat.name(), amount, percentage, count));
        }

        result.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return result;
    }
}

