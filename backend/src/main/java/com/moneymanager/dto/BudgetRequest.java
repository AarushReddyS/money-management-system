package com.moneymanager.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BudgetRequest {

    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    @NotNull(message = "Total budget is required")
    @DecimalMin(value = "0.01", message = "Total budget must be greater than zero")
    private BigDecimal totalBudget;

    private String notes;

    @Valid
    private List<CategoryBudgetDto> categories = new ArrayList<>();

    public BudgetRequest() {
    }

    public BudgetRequest(Integer year, Integer month, BigDecimal totalBudget, String notes, List<CategoryBudgetDto> categories) {
        this.year = year;
        this.month = month;
        this.totalBudget = totalBudget;
        this.notes = notes;
        this.categories = categories != null ? categories : new ArrayList<>();
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<CategoryBudgetDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryBudgetDto> categories) {
        this.categories = categories;
    }
}

