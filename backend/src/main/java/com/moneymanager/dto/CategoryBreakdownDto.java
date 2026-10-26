package com.moneymanager.dto;

import java.math.BigDecimal;

public class CategoryBreakdownDto {
    private String category;
    private BigDecimal amount;
    private double percentage;
    private long count;

    public CategoryBreakdownDto() {
    }

    public CategoryBreakdownDto(String category, BigDecimal amount, double percentage, long count) {
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
        this.count = count;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}

