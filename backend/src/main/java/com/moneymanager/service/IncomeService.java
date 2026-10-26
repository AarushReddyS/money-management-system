package com.moneymanager.service;

import com.moneymanager.dto.IncomeRequest;
import com.moneymanager.dto.IncomeResponse;
import com.moneymanager.entity.Income;
import com.moneymanager.entity.User;
import com.moneymanager.enums.IncomeCategory;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Transactional
    public IncomeResponse createIncome(User user, IncomeRequest request) {
        Income income = new Income(
                user,
                request.getTitle().trim(),
                request.getAmount(),
                request.getCategory(),
                request.getDate(),
                request.getPaymentMethod(),
                request.getDescription()
        );

        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    @Transactional
    public IncomeResponse updateIncome(User user, Long id, IncomeRequest request) {
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        income.setTitle(request.getTitle().trim());
        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setDate(request.getDate());
        income.setPaymentMethod(request.getPaymentMethod());
        income.setDescription(request.getDescription());

        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    @Transactional
    public void deleteIncome(User user, Long id) {
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        incomeRepository.delete(income);
    }

    public IncomeResponse getIncomeById(User user, Long id) {
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        return mapToResponse(income);
    }

    public List<IncomeResponse> getAllIncomes(User user, LocalDate startDate, LocalDate endDate, IncomeCategory category) {
        List<Income> list;

        if (startDate != null && endDate != null) {
            list = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        } else if (category != null) {
            list = incomeRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        } else {
            list = incomeRepository.findByUserOrderByDateDescCreatedAtDesc(user);
        }

        if (category != null && startDate != null) {
            list = list.stream()
                    .filter(i -> i.getCategory() == category)
                    .collect(Collectors.toList());
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public IncomeResponse mapToResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getTitle(),
                income.getAmount(),
                income.getCategory(),
                income.getDate(),
                income.getPaymentMethod(),
                income.getDescription(),
                income.getCreatedAt()
        );
    }
}

