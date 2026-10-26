package com.moneymanager.dto;

import com.moneymanager.enums.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CategoryBudgetDto {

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @NotNull(message = "Allocated amount is required")
    @DecimalMin(value = "0.01", message = "Allocated amount must be greater than zero")
    private BigDecimal allocatedAmount;

    public CategoryBudgetDto() {
    }

    public CategoryBudgetDto(ExpenseCategory category, BigDecimal allocatedAmount) {
        this.category = category;
        this.allocatedAmount = allocatedAmount;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }
}

