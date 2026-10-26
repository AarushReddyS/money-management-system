package com.moneymanager.repository;

import com.moneymanager.entity.Income;
import com.moneymanager.entity.User;
import com.moneymanager.enums.IncomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserOrderByDateDescCreatedAtDesc(User user);

    List<Income> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    List<Income> findByUserAndCategoryOrderByDateDesc(User user, IncomeCategory category);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user = :user")
    BigDecimal sumTotalByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user = :user AND i.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i.category, COALESCE(SUM(i.amount), 0), COUNT(i) FROM Income i WHERE i.user = :user AND i.date BETWEEN :startDate AND :endDate GROUP BY i.category")
    List<Object[]> findCategoryBreakdownBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i.category, COALESCE(SUM(i.amount), 0), COUNT(i) FROM Income i WHERE i.user = :user GROUP BY i.category")
    List<Object[]> findCategoryBreakdownAllTime(@Param("user") User user);
}

