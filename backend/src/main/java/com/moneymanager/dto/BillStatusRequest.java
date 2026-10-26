package com.moneymanager.dto;

import com.moneymanager.enums.BillStatus;
import jakarta.validation.constraints.NotNull;

public class BillStatusRequest {

    @NotNull(message = "Status is required")
    private BillStatus status;

    public BillStatusRequest() {
    }

    public BillStatusRequest(BillStatus status) {
        this.status = status;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }
}

