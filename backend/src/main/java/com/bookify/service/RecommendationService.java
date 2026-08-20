package com.bookify.service;

import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.entity.Book;
import com.bookify.entity.Category;
import com.bookify.entity.ReadingProgress;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.BookMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.FavoriteRepository;
import com.bookify.repository.ReadingProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReadingProgressRepository readingProgressRepository;
    private final BookService bookService;
    private final BookMapper bookMapper;

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getPersonalizedRecommendations(Long userId, Pageable pageable) {
        Set<Long> readBookIds = readingProgressRepository.findBookIdsByUserId(userId);
        Set<Long> favBookIds = favoriteRepository.findBookIdsByUserId(userId);
        Set<Long> excludedBookIds = new HashSet<>(readBookIds);
        excludedBookIds.addAll(favBookIds);

        List<ReadingProgress> history = readingProgressRepository.findByUserId(userId, PageRequest.of(0, 50)).getContent();
        Set<Long> preferredCategoryIds = history.stream()
                .flatMap(rp -> rp.getBook().getCategories().stream())
                .map(Category::getId)
                .collect(Collectors.toSet());

        if (preferredCategoryIds.isEmpty()) {
            return bookService.getTopRatedBooks(pageable);
        }

        if (excludedBookIds.isEmpty()) {
            excludedBookIds = Collections.singleton(0L);
        }

        List<Book> recommended = bookRepository.findRecommendedForUserCategories(preferredCategoryIds, excludedBookIds, pageable);
        if (recommended.isEmpty()) {
            return bookService.getTopRatedBooks(pageable);
        }

        return bookMapper.toSummaryResponseList(recommended);
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getBecauseYouRead(Long bookId, Pageable pageable) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        Set<Long> categoryIds = book.getCategories().stream().map(Category::getId).collect(Collectors.toSet());
        if (categoryIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Book> similar = bookRepository.findSimilarBooks(categoryIds, bookId, pageable);
        return bookMapper.toSummaryResponseList(similar);
    }
}
