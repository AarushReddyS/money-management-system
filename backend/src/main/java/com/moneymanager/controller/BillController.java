package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.BillRequest;
import com.moneymanager.dto.BillResponse;
import com.moneymanager.dto.BillStatusRequest;
import com.moneymanager.entity.User;
import com.moneymanager.enums.BillStatus;
import com.moneymanager.service.BillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BillResponse>>> getAllBills(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) BillStatus status) {

        List<BillResponse> bills = billService.getAllBills(user, status);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getUpcomingBills(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "14") int daysAhead) {

        List<BillResponse> upcoming = billService.getUpcomingBills(user, daysAhead);
        return ResponseEntity.ok(ApiResponse.success(upcoming));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillResponse>> getBillById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        BillResponse bill = billService.getBillById(user, id);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BillResponse>> createBill(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BillRequest request) {

        BillResponse response = billService.createBill(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bill created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillResponse>> updateBill(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BillRequest request) {

        BillResponse response = billService.updateBill(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("Bill updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BillResponse>> updateBillStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BillStatusRequest request) {

        BillResponse response = billService.updateBillStatus(user, id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Bill status updated successfully", response));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<BillResponse>> markAsPaid(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        BillResponse response = billService.markBillAsPaid(user, id);
        return ResponseEntity.ok(ApiResponse.success("Bill marked as paid", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBill(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        billService.deleteBill(user, id);
        return ResponseEntity.ok(ApiResponse.success("Bill deleted successfully", null));
    }
}

