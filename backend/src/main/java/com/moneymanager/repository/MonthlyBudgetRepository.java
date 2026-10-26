package com.moneymanager.repository;

import com.moneymanager.entity.MonthlyBudget;
import com.moneymanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Long> {

    Optional<MonthlyBudget> findByUserAndYearAndMonth(User user, Integer year, Integer month);

    List<MonthlyBudget> findByUserOrderByYearDescMonthDesc(User user);

    boolean existsByUserAndYearAndMonth(User user, Integer year, Integer month);
}

