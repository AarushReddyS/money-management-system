package com.moneymanager.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BudgetResponse {
    private Long id;
    private Integer year;
    private Integer month;
    private BigDecimal totalBudget;
    private String notes;
    private List<CategoryBudgetDto> categories = new ArrayList<>();
    private LocalDateTime createdAt;

    public BudgetResponse() {
    }

    public BudgetResponse(Long id, Integer year, Integer month, BigDecimal totalBudget, String notes,
                          List<CategoryBudgetDto> categories, LocalDateTime createdAt) {
        this.id = id;
        this.year = year;
        this.month = month;
        this.totalBudget = totalBudget;
        this.notes = notes;
        this.categories = categories != null ? categories : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

