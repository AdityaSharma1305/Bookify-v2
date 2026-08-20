package com.bookify.service;

import com.bookify.dto.request.reading.ReadingProgressUpdateRequest;
import com.bookify.dto.request.reading.ReadingStatusUpdateRequest;
import com.bookify.dto.response.reading.ReadingProgressResponse;
import com.bookify.entity.Book;
import com.bookify.entity.NotificationType;
import com.bookify.entity.ReadingProgress;
import com.bookify.entity.ReadingStatus;
import com.bookify.entity.User;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.ReadingProgressMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.ReadingProgressRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReadingProgressService {

    private final ReadingProgressRepository readingProgressRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final NotificationService notificationService;
    private final ReadingProgressMapper readingProgressMapper;

    @Transactional(readOnly = true)
    public Page<ReadingProgressResponse> getUserLibrary(Long userId, ReadingStatus status, Pageable pageable) {
        if (status != null) {
            return readingProgressRepository.findByUserIdAndStatus(userId, status, pageable)
                    .map(readingProgressMapper::toResponse);
        }
        return readingProgressRepository.findByUserId(userId, pageable).map(readingProgressMapper::toResponse);
    }

    @Transactional
    public ReadingProgressResponse updateStatus(Long userId, Long bookId, ReadingStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> ReadingProgress.builder().user(user).book(book).build());

        progress.setStatus(request.getStatus());

        if (request.getStatus() == ReadingStatus.CURRENTLY_READING && progress.getStartedAt() == null) {
            progress.setStartedAt(LocalDate.now());
        } else if (request.getStatus() == ReadingStatus.COMPLETED) {
            progress.setCompletedAt(LocalDate.now());
            if (book.getPageCount() != null) {
                progress.setCurrentPage(book.getPageCount());
            }
            checkMilestones(user);
        }

        readingProgressRepository.save(progress);
        return readingProgressMapper.toResponse(progress);
    }

    @Transactional
    public ReadingProgressResponse updateProgress(Long userId, Long bookId, ReadingProgressUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        ReadingProgress progress = readingProgressRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> ReadingProgress.builder().user(user).book(book).status(ReadingStatus.CURRENTLY_READING).startedAt(LocalDate.now()).build());

        if (request.getStatus() != null) {
            progress.setStatus(request.getStatus());
        }

        if (request.getCurrentPage() != null) {
            progress.setCurrentPage(request.getCurrentPage());
            if (book.getPageCount() != null && request.getCurrentPage() >= book.getPageCount()) {
                progress.setStatus(ReadingStatus.COMPLETED);
                progress.setCompletedAt(LocalDate.now());
                checkMilestones(user);
            }
        }

        readingProgressRepository.save(progress);
        return readingProgressMapper.toResponse(progress);
    }

    @Transactional
    public void deleteReadingProgress(Long userId, Long bookId) {
        readingProgressRepository.findByUserIdAndBookId(userId, bookId).ifPresent(readingProgressRepository::delete);
    }

    private void checkMilestones(User user) {
        long completedCount = readingProgressRepository.countByUserIdAndStatus(user.getId(), ReadingStatus.COMPLETED);
        if (completedCount == 1 || completedCount == 5 || completedCount == 10 || completedCount == 25 || completedCount == 50 || completedCount == 100) {
            notificationService.createNotification(
                    user,
                    "Reading Milestone Reached! 🎉",
                    "Congratulations! You have completed " + completedCount + " books on Bookify!",
                    NotificationType.MILESTONE,
                    "/dashboard"
            );
        }
    }
}
