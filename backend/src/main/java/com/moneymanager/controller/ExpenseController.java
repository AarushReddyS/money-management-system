package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.ExpenseRequest;
import com.moneymanager.dto.ExpenseResponse;
import com.moneymanager.entity.User;
import com.moneymanager.enums.ExpenseCategory;
import com.moneymanager.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) ExpenseCategory category) {

        List<ExpenseResponse> expenses = expenseService.getAllExpenses(user, startDate, endDate, category);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        ExpenseResponse expense = expenseService.getExpenseById(user, id);
        return ResponseEntity.ok(ApiResponse.success(expense));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse response = expenseService.createExpense(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense added successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse response = expenseService.updateExpense(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        expenseService.deleteExpense(user, id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }
}

