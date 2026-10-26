package com.moneymanager.service;

import com.moneymanager.dto.ExpenseRequest;
import com.moneymanager.dto.ExpenseResponse;
import com.moneymanager.entity.Expense;
import com.moneymanager.entity.User;
import com.moneymanager.enums.ExpenseCategory;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Transactional
    public ExpenseResponse createExpense(User user, ExpenseRequest request) {
        Expense expense = new Expense(
                user,
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDate(),
                request.getPaymentMethod(),
                request.getNotes()
        );

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(User user, Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setNotes(request.getNotes());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    public void deleteExpense(User user, Long id) {
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        expenseRepository.delete(expense);
    }

    public ExpenseResponse getExpenseById(User user, Long id) {
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getAllExpenses(User user, LocalDate startDate, LocalDate endDate, ExpenseCategory category) {
        List<Expense> list;

        if (startDate != null && endDate != null) {
            list = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        } else if (category != null) {
            list = expenseRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        } else {
            list = expenseRepository.findByUserOrderByDateDescCreatedAtDesc(user);
        }

        if (category != null && startDate != null) {
            list = list.stream()
                    .filter(e -> e.getCategory() == category)
                    .collect(Collectors.toList());
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ExpenseResponse mapToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getPaymentMethod(),
                expense.getNotes(),
                expense.getCreatedAt()
        );
    }
}

