package com.moneymanager.dto;

import com.moneymanager.enums.BillCategory;
import com.moneymanager.enums.RecurrenceFrequency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BillRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private BillCategory category;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private Boolean isRecurring = false;
    private RecurrenceFrequency recurrenceFrequency = RecurrenceFrequency.MONTHLY;
    private Boolean autoPay = false;
    private String notes;

    public BillRequest() {
    }

    public BillRequest(String title, BigDecimal amount, BillCategory category, LocalDate dueDate,
                       Boolean isRecurring, RecurrenceFrequency recurrenceFrequency, Boolean autoPay, String notes) {
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.dueDate = dueDate;
        this.isRecurring = isRecurring;
        this.recurrenceFrequency = recurrenceFrequency;
        this.autoPay = autoPay;
        this.notes = notes;
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
}

