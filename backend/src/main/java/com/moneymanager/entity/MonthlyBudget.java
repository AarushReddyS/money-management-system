package com.moneymanager.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "monthly_budgets", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_year_month", columnNames = {"user_id", "year", "month"})
})
public class MonthlyBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "total_budget", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalBudget;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "monthlyBudget", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BudgetCategory> categories = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public MonthlyBudget() {
    }

    public MonthlyBudget(User user, Integer year, Integer month, BigDecimal totalBudget, String notes) {
        this.user = user;
        this.year = year;
        this.month = month;
        this.totalBudget = totalBudget;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void addCategory(BudgetCategory category) {
        categories.add(category);
        category.setMonthlyBudget(this);
    }

    public void removeCategory(BudgetCategory category) {
        categories.remove(category);
        category.setMonthlyBudget(null);
    }

    public void clearCategories() {
        for (BudgetCategory cat : categories) {
            cat.setMonthlyBudget(null);
        }
        categories.clear();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<BudgetCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<BudgetCategory> categories) {
        this.categories = categories;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

