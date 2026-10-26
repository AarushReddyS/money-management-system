package com.moneymanager.service;

import com.moneymanager.dto.BillRequest;
import com.moneymanager.dto.BillResponse;
import com.moneymanager.entity.Bill;
import com.moneymanager.entity.User;
import com.moneymanager.enums.BillStatus;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Transactional
    public BillResponse createBill(User user, BillRequest request) {
        Bill bill = new Bill(
                user,
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDueDate(),
                request.getIsRecurring(),
                request.getRecurrenceFrequency(),
                request.getAutoPay(),
                request.getNotes()
        );

        if (bill.getDueDate().isBefore(LocalDate.now())) {
            bill.setStatus(BillStatus.OVERDUE);
        }

        bill = billRepository.save(bill);
        return mapToResponse(bill);
    }

    @Transactional
    public BillResponse updateBill(User user, Long id, BillRequest request) {
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setTitle(request.getTitle().trim());
        bill.setAmount(request.getAmount());
        bill.setCategory(request.getCategory());
        bill.setDueDate(request.getDueDate());
        bill.setIsRecurring(request.getIsRecurring());
        bill.setRecurrenceFrequency(request.getRecurrenceFrequency());
        bill.setAutoPay(request.getAutoPay());
        bill.setNotes(request.getNotes());

        if (bill.getStatus() == BillStatus.PENDING && bill.getDueDate().isBefore(LocalDate.now())) {
            bill.setStatus(BillStatus.OVERDUE);
        }

        bill = billRepository.save(bill);
        return mapToResponse(bill);
    }

    @Transactional
    public void deleteBill(User user, Long id) {
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        billRepository.delete(bill);
    }

    public BillResponse getBillById(User user, Long id) {
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        return mapToResponse(bill);
    }

    public List<BillResponse> getAllBills(User user, BillStatus status) {
        List<Bill> bills;
        if (status != null) {
            bills = billRepository.findByUserAndStatusOrderByDueDateAsc(user, status);
        } else {
            bills = billRepository.findByUserOrderByDueDateAsc(user);
        }

        // Auto-update overdue status for pending bills
        LocalDate today = LocalDate.now();
        for (Bill b : bills) {
            if (b.getStatus() == BillStatus.PENDING && b.getDueDate().isBefore(today)) {
                b.setStatus(BillStatus.OVERDUE);
            }
        }

        return bills.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public BillResponse updateBillStatus(User user, Long id, BillStatus status) {
        Bill bill = billRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setStatus(status);
        if (status == BillStatus.PAID) {
            bill.setPaidAt(LocalDateTime.now());
        } else {
            bill.setPaidAt(null);
        }

        bill = billRepository.save(bill);
        return mapToResponse(bill);
    }

    @Transactional
    public BillResponse markBillAsPaid(User user, Long id) {
        return updateBillStatus(user, id, BillStatus.PAID);
    }

    public List<BillResponse> getUpcomingBills(User user, int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);

        List<Bill> upcoming = billRepository.findUpcomingBills(user, today, futureDate);
        return upcoming.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BillResponse mapToResponse(Bill bill) {
        return new BillResponse(
                bill.getId(),
                bill.getTitle(),
                bill.getAmount(),
                bill.getCategory(),
                bill.getDueDate(),
                bill.getStatus(),
                bill.getIsRecurring(),
                bill.getRecurrenceFrequency(),
                bill.getAutoPay(),
                bill.getNotes(),
                bill.getPaidAt(),
                bill.getCreatedAt()
        );
    }
}

