package com.bookify.repository;

import com.bookify.entity.ReadingProgress;
import com.bookify.entity.ReadingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    Optional<ReadingProgress> findByUserIdAndBookId(Long userId, Long bookId);
    Page<ReadingProgress> findByUserIdAndStatus(Long userId, ReadingStatus status, Pageable pageable);
    Page<ReadingProgress> findByUserId(Long userId, Pageable pageable);
    long countByUserIdAndStatus(Long userId, ReadingStatus status);

    @Query("SELECT rp.book.id FROM ReadingProgress rp WHERE rp.user.id = :userId")
    Set<Long> findBookIdsByUserId(Long userId);

    @Query("SELECT rp FROM ReadingProgress rp WHERE rp.user.id = :userId ORDER BY rp.updatedAt DESC")
    List<ReadingProgress> findRecentActivityByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT MONTH(rp.completedAt) as month, COUNT(rp) as count FROM ReadingProgress rp " +
            "WHERE rp.user.id = :userId AND rp.status = 'COMPLETED' AND YEAR(rp.completedAt) = :year " +
            "GROUP BY MONTH(rp.completedAt)")
    List<Object[]> getBooksReadPerMonth(@Param("userId") Long userId, @Param("year") int year);
}
