package com.bookify.repository;

import com.bookify.entity.PasswordResetToken;
import com.bookify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findTopByUserOrderByCreatedAtDesc(User user);
    default Optional<PasswordResetToken> findByUser(User user) {
        return findTopByUserOrderByCreatedAtDesc(user);
    }
    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true WHERE t.user = :user")
    void invalidateUserTokens(User user);
}
