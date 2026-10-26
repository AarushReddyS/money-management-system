package com.moneymanager.dto;

import com.moneymanager.enums.BillCategory;
import com.moneymanager.enums.BillStatus;
import com.moneymanager.enums.RecurrenceFrequency;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BillResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private BillCategory category;
    private LocalDate dueDate;
    private BillStatus status;
    private Boolean isRecurring;
    private RecurrenceFrequency recurrenceFrequency;
    private Boolean autoPay;
    private String notes;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private boolean overdue;

    public BillResponse() {
    }

    public BillResponse(Long id, String title, BigDecimal amount, BillCategory category, LocalDate dueDate,
                        BillStatus status, Boolean isRecurring, RecurrenceFrequency recurrenceFrequency,
                        Boolean autoPay, String notes, LocalDateTime paidAt, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status;
        this.isRecurring = isRecurring;
        this.recurrenceFrequency = recurrenceFrequency;
        this.autoPay = autoPay;
        this.notes = notes;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.overdue = (status == BillStatus.PENDING || status == BillStatus.OVERDUE) && dueDate.isBefore(LocalDate.now());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isOverdue() {
        return overdue;
    }

    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }
}

