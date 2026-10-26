package com.moneymanager.repository;

import com.moneymanager.entity.Expense;
import com.moneymanager.entity.User;
import com.moneymanager.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByDateDescCreatedAtDesc(User user);

    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserAndCategoryOrderByDateDesc(User user, ExpenseCategory category);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user")
    BigDecimal sumTotalByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.category = :category AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndCategoryAndDateBetween(@Param("user") User user, @Param("category") ExpenseCategory category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0), COUNT(e) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :startDate AND :endDate GROUP BY e.category")
    List<Object[]> findCategoryBreakdownBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0), COUNT(e) FROM Expense e WHERE e.user = :user GROUP BY e.category")
    List<Object[]> findCategoryBreakdownAllTime(@Param("user") User user);
}

