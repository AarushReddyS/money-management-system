package com.moneymanager.dto;

import java.math.BigDecimal;

public class DashboardSummaryDto {
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    private BigDecimal monthlyNetSavings;
    private double monthlySavingsRate;

    private BigDecimal totalIncomeAllTime;
    private BigDecimal totalExpenseAllTime;
    private BigDecimal netWorth;

    private long pendingBillsCount;
    private BigDecimal pendingBillsAmount;
    private long overdueBillsCount;

    private BigDecimal currentMonthBudget;
    private double budgetSpentPercentage;
    private boolean isBudgetExceeded;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(BigDecimal monthlyIncome, BigDecimal monthlyExpense, BigDecimal monthlyNetSavings,
                               double monthlySavingsRate, BigDecimal totalIncomeAllTime, BigDecimal totalExpenseAllTime,
                               BigDecimal netWorth, long pendingBillsCount, BigDecimal pendingBillsAmount,
                               long overdueBillsCount, BigDecimal currentMonthBudget, double budgetSpentPercentage,
                               boolean isBudgetExceeded) {
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpense = monthlyExpense;
        this.monthlyNetSavings = monthlyNetSavings;
        this.monthlySavingsRate = monthlySavingsRate;
        this.totalIncomeAllTime = totalIncomeAllTime;
        this.totalExpenseAllTime = totalExpenseAllTime;
        this.netWorth = netWorth;
        this.pendingBillsCount = pendingBillsCount;
        this.pendingBillsAmount = pendingBillsAmount;
        this.overdueBillsCount = overdueBillsCount;
        this.currentMonthBudget = currentMonthBudget;
        this.budgetSpentPercentage = budgetSpentPercentage;
        this.isBudgetExceeded = isBudgetExceeded;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getMonthlyExpense() {
        return monthlyExpense;
    }

    public void setMonthlyExpense(BigDecimal monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }

    public BigDecimal getMonthlyNetSavings() {
        return monthlyNetSavings;
    }

    public void setMonthlyNetSavings(BigDecimal monthlyNetSavings) {
        this.monthlyNetSavings = monthlyNetSavings;
    }

    public double getMonthlySavingsRate() {
        return monthlySavingsRate;
    }

    public void setMonthlySavingsRate(double monthlySavingsRate) {
        this.monthlySavingsRate = monthlySavingsRate;
    }

    public BigDecimal getTotalIncomeAllTime() {
        return totalIncomeAllTime;
    }

    public void setTotalIncomeAllTime(BigDecimal totalIncomeAllTime) {
        this.totalIncomeAllTime = totalIncomeAllTime;
    }

    public BigDecimal getTotalExpenseAllTime() {
        return totalExpenseAllTime;
    }

    public void setTotalExpenseAllTime(BigDecimal totalExpenseAllTime) {
        this.totalExpenseAllTime = totalExpenseAllTime;
    }

    public BigDecimal getNetWorth() {
        return netWorth;
    }

    public void setNetWorth(BigDecimal netWorth) {
        this.netWorth = netWorth;
    }

    public long getPendingBillsCount() {
        return pendingBillsCount;
    }

    public void setPendingBillsCount(long pendingBillsCount) {
        this.pendingBillsCount = pendingBillsCount;
    }

    public BigDecimal getPendingBillsAmount() {
        return pendingBillsAmount;
    }

    public void setPendingBillsAmount(BigDecimal pendingBillsAmount) {
        this.pendingBillsAmount = pendingBillsAmount;
    }

    public long getOverdueBillsCount() {
        return overdueBillsCount;
    }

    public void setOverdueBillsCount(long overdueBillsCount) {
        this.overdueBillsCount = overdueBillsCount;
    }

    public BigDecimal getCurrentMonthBudget() {
        return currentMonthBudget;
    }

    public void setCurrentMonthBudget(BigDecimal currentMonthBudget) {
        this.currentMonthBudget = currentMonthBudget;
    }

    public double getBudgetSpentPercentage() {
        return budgetSpentPercentage;
    }

    public void setBudgetSpentPercentage(double budgetSpentPercentage) {
        this.budgetSpentPercentage = budgetSpentPercentage;
    }

    public boolean isBudgetExceeded() {
        return isBudgetExceeded;
    }

    public void setBudgetExceeded(boolean budgetExceeded) {
        isBudgetExceeded = budgetExceeded;
    }
}

