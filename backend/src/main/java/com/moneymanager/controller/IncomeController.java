package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.IncomeRequest;
import com.moneymanager.dto.IncomeResponse;
import com.moneymanager.entity.User;
import com.moneymanager.enums.IncomeCategory;
import com.moneymanager.service.IncomeService;
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
@RequestMapping("/api/incomes")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncomeResponse>>> getAllIncomes(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) IncomeCategory category) {

        List<IncomeResponse> incomes = incomeService.getAllIncomes(user, startDate, endDate, category);
        return ResponseEntity.ok(ApiResponse.success(incomes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> getIncomeById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        IncomeResponse income = incomeService.getIncomeById(user, id);
        return ResponseEntity.ok(ApiResponse.success(income));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody IncomeRequest request) {

        IncomeResponse response = incomeService.createIncome(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Income added successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request) {

        IncomeResponse response = incomeService.updateIncome(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Income updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        incomeService.deleteIncome(user, id);
        return ResponseEntity.ok(ApiResponse.success("Income deleted successfully", null));
    }
}

