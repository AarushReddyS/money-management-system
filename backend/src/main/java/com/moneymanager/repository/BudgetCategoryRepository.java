package com.moneymanager.repository;

import com.moneymanager.entity.BudgetCategory;
import com.moneymanager.entity.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {
    List<BudgetCategory> findByMonthlyBudget(MonthlyBudget monthlyBudget);
}

