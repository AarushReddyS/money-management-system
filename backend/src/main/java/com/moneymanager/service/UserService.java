package com.moneymanager.service;

import com.moneymanager.dto.ChangePasswordRequest;
import com.moneymanager.dto.UserProfileDto;
import com.moneymanager.entity.User;
import com.moneymanager.exception.BadRequestException;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileDto getProfile(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getCurrency()
        );
    }

    @Transactional
    public UserProfileDto updateProfile(User user, UserProfileDto request) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) {
            existingUser.setFullName(request.getFullName().trim());
        }
        if (request.getCurrency() != null && !request.getCurrency().isBlank()) {
            existingUser.setCurrency(request.getCurrency().trim().toUpperCase());
        }

        existingUser = userRepository.save(existingUser);

        return new UserProfileDto(
                existingUser.getId(),
                existingUser.getUsername(),
                existingUser.getEmail(),
                existingUser.getFullName(),
                existingUser.getCurrency()
        );
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), existingUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        existingUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(existingUser);
    }
}

