package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.BudgetComparisonDto;
import com.moneymanager.dto.BudgetRequest;
import com.moneymanager.dto.BudgetResponse;
import com.moneymanager.entity.User;
import com.moneymanager.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createOrUpdateBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest request) {

        BudgetResponse response = budgetService.createOrUpdateBudget(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Monthly budget saved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets(
            @AuthenticationPrincipal User user) {

        List<BudgetResponse> budgets = budgetService.getAllBudgets(user);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @GetMapping("/{year}/{month}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Integer year,
            @PathVariable Integer month) {

        BudgetResponse budget = budgetService.getBudget(user, year, month);
        return ResponseEntity.ok(ApiResponse.success(budget));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<BudgetResponse>> getCurrentMonthBudget(
            @AuthenticationPrincipal User user) {

        LocalDate now = LocalDate.now();
        BudgetResponse budget = budgetService.getBudget(user, now.getYear(), now.getMonthValue());
        return ResponseEntity.ok(ApiResponse.success(budget));
    }

    @GetMapping("/comparison")
    public ResponseEntity<ApiResponse<BudgetComparisonDto>> getBudgetComparison(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();

        BudgetComparisonDto comparison = budgetService.getBudgetComparison(user, targetYear, targetMonth);
        return ResponseEntity.ok(ApiResponse.success(comparison));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        budgetService.deleteBudget(user, id);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}

