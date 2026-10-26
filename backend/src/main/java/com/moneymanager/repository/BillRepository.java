package com.moneymanager.repository;

import com.moneymanager.entity.Bill;
import com.moneymanager.entity.User;
import com.moneymanager.enums.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByUserOrderByDueDateAsc(User user);

    List<Bill> findByUserAndStatusOrderByDueDateAsc(User user, BillStatus status);

    long countByUserAndStatus(User user, BillStatus status);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.user = :user AND (b.status = 'PENDING' OR b.status = 'OVERDUE') AND b.dueDate < :today")
    long countOverdueBills(@Param("user") User user, @Param("today") LocalDate today);

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b WHERE b.user = :user AND (b.status = 'PENDING' OR b.status = 'OVERDUE')")
    BigDecimal sumPendingBillsAmount(@Param("user") User user);

    @Query("SELECT b FROM Bill b WHERE b.user = :user AND (b.status = 'PENDING' OR b.status = 'OVERDUE') AND b.dueDate BETWEEN :startDate AND :endDate ORDER BY b.dueDate ASC")
    List<Bill> findUpcomingBills(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

