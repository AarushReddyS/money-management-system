package com.moneymanager.dto;

import com.moneymanager.enums.ExpenseCategory;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BudgetComparisonDto {
    private Integer year;
    private Integer month;
    private BigDecimal totalBudget;
    private BigDecimal totalSpent;
    private BigDecimal remainingBudget;
    private double percentageSpent;
    private boolean isOverBudget;
    private List<CategoryComparisonDto> categoryComparisons = new ArrayList<>();

    public static class CategoryComparisonDto {
        private ExpenseCategory category;
        private BigDecimal allocatedAmount;
        private BigDecimal spentAmount;
        private BigDecimal remainingAmount;
        private double percentageSpent;
        private boolean isOverBudget;

        public CategoryComparisonDto() {
        }

        public CategoryComparisonDto(ExpenseCategory category, BigDecimal allocatedAmount, BigDecimal spentAmount,
                                     BigDecimal remainingAmount, double percentageSpent, boolean isOverBudget) {
            this.category = category;
            this.allocatedAmount = allocatedAmount;
            this.spentAmount = spentAmount;
            this.remainingAmount = remainingAmount;
            this.percentageSpent = percentageSpent;
            this.isOverBudget = isOverBudget;
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

        public BigDecimal getSpentAmount() {
            return spentAmount;
        }

        public void setSpentAmount(BigDecimal spentAmount) {
            this.spentAmount = spentAmount;
        }

        public BigDecimal getRemainingAmount() {
            return remainingAmount;
        }

        public void setRemainingAmount(BigDecimal remainingAmount) {
            this.remainingAmount = remainingAmount;
        }

        public double getPercentageSpent() {
            return percentageSpent;
        }

        public void setPercentageSpent(double percentageSpent) {
            this.percentageSpent = percentageSpent;
        }

        public boolean isOverBudget() {
            return isOverBudget;
        }

        public void setOverBudget(boolean overBudget) {
            isOverBudget = overBudget;
        }
    }

    public BudgetComparisonDto() {
    }

    public BudgetComparisonDto(Integer year, Integer month, BigDecimal totalBudget, BigDecimal totalSpent,
                               BigDecimal remainingBudget, double percentageSpent, boolean isOverBudget,
                               List<CategoryComparisonDto> categoryComparisons) {
        this.year = year;
        this.month = month;
        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.remainingBudget = remainingBudget;
        this.percentageSpent = percentageSpent;
        this.isOverBudget = isOverBudget;
        this.categoryComparisons = categoryComparisons != null ? categoryComparisons : new ArrayList<>();
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

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public double getPercentageSpent() {
        return percentageSpent;
    }

    public void setPercentageSpent(double percentageSpent) {
        this.percentageSpent = percentageSpent;
    }

    public boolean isOverBudget() {
        return isOverBudget;
    }

    public void setOverBudget(boolean overBudget) {
        isOverBudget = overBudget;
    }

    public List<CategoryComparisonDto> getCategoryComparisons() {
        return categoryComparisons;
    }

    public void setCategoryComparisons(List<CategoryComparisonDto> categoryComparisons) {
        this.categoryComparisons = categoryComparisons;
    }
}

