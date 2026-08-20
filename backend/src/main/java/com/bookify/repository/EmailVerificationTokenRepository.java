package com.bookify.repository;

import com.bookify.entity.EmailVerificationToken;
import com.bookify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
    Optional<EmailVerificationToken> findByUserAndUsedFalse(User user);

    @Modifying
    @Query("UPDATE EmailVerificationToken t SET t.used = true WHERE t.user = :user")
    void invalidateUserTokens(User user);
}
