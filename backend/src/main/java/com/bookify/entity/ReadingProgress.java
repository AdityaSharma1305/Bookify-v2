package com.bookify.entity;

import com.bookify.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reading_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uq_reading_user_book", columnNames = {"user_id", "book_id"})
}, indexes = {
        @Index(name = "idx_reading_user", columnList = "user_id"),
        @Index(name = "idx_reading_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ReadingStatus status = ReadingStatus.WANT_TO_READ;

    @Column(name = "current_page")
    @Builder.Default
    private Integer currentPage = 0;

    @Column(name = "started_at")
    private LocalDate startedAt;

    @Column(name = "completed_at")
    private LocalDate completedAt;
}
