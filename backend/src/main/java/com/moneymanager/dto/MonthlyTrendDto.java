package com.moneymanager.dto;

import java.math.BigDecimal;

public class MonthlyTrendDto {
    private int year;
    private int month;
    private String monthLabel;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netSavings;

    public MonthlyTrendDto() {
    }

    public MonthlyTrendDto(int year, int month, String monthLabel, BigDecimal income, BigDecimal expense, BigDecimal netSavings) {
        this.year = year;
        this.month = month;
        this.monthLabel = monthLabel;
        this.income = income;
        this.expense = expense;
        this.netSavings = netSavings;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getMonthLabel() {
        return monthLabel;
    }

    public void setMonthLabel(String monthLabel) {
        this.monthLabel = monthLabel;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }
}

