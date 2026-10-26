package com.moneymanager.entity;

import com.moneymanager.enums.BillCategory;
import com.moneymanager.enums.BillStatus;
import com.moneymanager.enums.RecurrenceFrequency;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills", indexes = {
    @Index(name = "idx_bill_user_due", columnList = "user_id, due_date"),
    @Index(name = "idx_bill_user_status", columnList = "user_id, status")
})
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private BillCategory category;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillStatus status = BillStatus.PENDING;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_frequency", length = 30)
    private RecurrenceFrequency recurrenceFrequency = RecurrenceFrequency.MONTHLY;

    @Column(name = "auto_pay")
    private Boolean autoPay = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Bill() {
    }

    public Bill(User user, String title, BigDecimal amount, BillCategory category, LocalDate dueDate,
                Boolean isRecurring, RecurrenceFrequency recurrenceFrequency, Boolean autoPay, String notes) {
        this.user = user;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.isRecurring = isRecurring != null ? isRecurring : false;
        this.recurrenceFrequency = recurrenceFrequency != null ? recurrenceFrequency : RecurrenceFrequency.MONTHLY;
        this.autoPay = autoPay != null ? autoPay : false;
        this.notes = notes;
        this.status = BillStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BillCategory getCategory() {
        return category;
    }

    public void setCategory(BillCategory category) {
        this.category = category;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public Boolean getIsRecurring() {
        return isRecurring;
    }

    public void setIsRecurring(Boolean recurring) {
        isRecurring = recurring;
    }

    public RecurrenceFrequency getRecurrenceFrequency() {
        return recurrenceFrequency;
    }

    public void setRecurrenceFrequency(RecurrenceFrequency recurrenceFrequency) {
        this.recurrenceFrequency = recurrenceFrequency;
    }

    public Boolean getAutoPay() {
        return autoPay;
    }

    public void setAutoPay(Boolean autoPay) {
        this.autoPay = autoPay;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

