package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.CategoryBreakdownDto;
import com.moneymanager.dto.DashboardSummaryDto;
import com.moneymanager.dto.MonthlyTrendDto;
import com.moneymanager.entity.User;
import com.moneymanager.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary(@AuthenticationPrincipal User user) {
        DashboardSummaryDto summary = dashboardService.getSummary(user);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<MonthlyTrendDto>>> getMonthlyTrends(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "6") int months) {

        List<MonthlyTrendDto> trends = dashboardService.getMonthlyTrends(user, months);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/categories/expenses")
    public ResponseEntity<ApiResponse<List<CategoryBreakdownDto>>> getExpenseCategories(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        List<CategoryBreakdownDto> breakdown = dashboardService.getExpenseCategoryBreakdown(user, year, month);
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }

    @GetMapping("/categories/incomes")
    public ResponseEntity<ApiResponse<List<CategoryBreakdownDto>>> getIncomeCategories(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        List<CategoryBreakdownDto> breakdown = dashboardService.getIncomeCategoryBreakdown(user, year, month);
        return ResponseEntity.ok(ApiResponse.success(breakdown));
    }
}

