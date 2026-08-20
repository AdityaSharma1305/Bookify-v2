package com.bookify.repository;

import com.bookify.entity.Role;
import com.bookify.entity.User;
import com.bookify.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
    long countByStatus(UserStatus status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    long countUsersRegisteredSince(LocalDateTime startDate);
}
