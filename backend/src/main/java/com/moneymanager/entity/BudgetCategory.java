package com.moneymanager.entity;

import com.moneymanager.enums.ExpenseCategory;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budget_categories")
public class BudgetCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private MonthlyBudget monthlyBudget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ExpenseCategory category;

    @Column(name = "allocated_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal allocatedAmount;

    public BudgetCategory() {
    }

    public BudgetCategory(ExpenseCategory category, BigDecimal allocatedAmount) {
        this.category = category;
        this.allocatedAmount = allocatedAmount;
    }

    public BudgetCategory(MonthlyBudget monthlyBudget, ExpenseCategory category, BigDecimal allocatedAmount) {
        this.monthlyBudget = monthlyBudget;
        this.category = category;
        this.allocatedAmount = allocatedAmount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MonthlyBudget getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(MonthlyBudget monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
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

