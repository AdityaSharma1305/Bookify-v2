package com.bookify.service;

import com.bookify.dto.request.book.BookCreateRequest;
import com.bookify.dto.request.book.BookSearchCriteria;
import com.bookify.dto.request.book.BookUpdateRequest;
import com.bookify.dto.response.book.BookDetailResponse;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.dto.response.review.RatingDistributionResponse;
import com.bookify.entity.*;
import com.bookify.exception.DuplicateResourceException;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.BookMapper;
import com.bookify.mapper.ReviewMapper;
import com.bookify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReadingProgressRepository readingProgressRepository;
    private final BookMapper bookMapper;
    private final ReviewMapper reviewMapper;

    @Transactional(readOnly = true)
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(bookMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookResponse> searchBooks(BookSearchCriteria criteria, Pageable pageable) {
        return bookRepository.searchBooks(
                criteria.getStatus() != null ? criteria.getStatus() : BookStatus.ACTIVE,
                criteria.getQuery(),
                criteria.getGenre(),
                criteria.getAuthorName(),
                criteria.getMinRating(),
                criteria.getMinPrice(),
                criteria.getMaxPrice(),
                criteria.getLanguage(),
                criteria.getFromYear(),
                criteria.getToYear(),
                pageable
        ).map(bookMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id, ErrorCode.BOOK_NOT_FOUND));
        return bookMapper.toResponse(book);
    }

    @Transactional(readOnly = true)
    public BookDetailResponse getBookDetails(Long bookId, Long currentUserId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + idBook(bookId), ErrorCode.BOOK_NOT_FOUND));

        BookDetailResponse response = bookMapper.toDetailResponse(book);

        Page<Review> reviewPage = reviewRepository.findByBookIdAndStatus(bookId, ReviewStatus.APPROVED, PageRequest.of(0, 5));
        response.setRecentReviews(reviewMapper.toResponseList(reviewPage.getContent()));
        response.setRatingDistribution(getRatingDistribution(bookId));

        Set<Long> categoryIds = book.getCategories().stream().map(Category::getId).collect(Collectors.toSet());
        if (!categoryIds.isEmpty()) {
            List<Book> related = bookRepository.findSimilarBooks(categoryIds, bookId, PageRequest.of(0, 6));
            response.setRelatedBooks(bookMapper.toSummaryResponseList(related));
        }

        if (book.getAuthor() != null) {
            List<Book> authorBooks = bookRepository.findOtherBooksByAuthor(book.getAuthor().getId(), bookId, PageRequest.of(0, 6));
            response.setOtherBooksByAuthor(bookMapper.toSummaryResponseList(authorBooks));
        }

        if (currentUserId != null) {
            response.setIsFavorite(favoriteRepository.existsByUserIdAndBookId(currentUserId, bookId));
            readingProgressRepository.findByUserIdAndBookId(currentUserId, bookId).ifPresent(rp -> {
                response.setReadingStatus(rp.getStatus().name());
                response.setCurrentPage(rp.getCurrentPage());
            });
        }

        return response;
    }

    private Long idBook(Long id) { return id; }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn().trim())) {
            throw new DuplicateResourceException("Book with ISBN " + request.getIsbn() + " already exists", ErrorCode.DUPLICATE_ISBN);
        }

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + request.getAuthorId(), ErrorCode.AUTHOR_NOT_FOUND));

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        }

        Book book = bookMapper.toEntity(request);
        book.setAuthor(author);
        book.setCategories(categories);
        if (request.getStatus() != null) {
            book.setStatus(request.getStatus());
        }
        bookRepository.save(book);

        return bookMapper.toResponse(book);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookUpdateRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id, ErrorCode.BOOK_NOT_FOUND));

        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Book with ISBN " + request.getIsbn() + " already exists", ErrorCode.DUPLICATE_ISBN);
        }

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + request.getAuthorId(), ErrorCode.AUTHOR_NOT_FOUND));

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        }

        bookMapper.updateEntityFromRequest(request, book);
        book.setAuthor(author);
        book.setCategories(categories);
        bookRepository.save(book);

        return bookMapper.toResponse(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id, ErrorCode.BOOK_NOT_FOUND));
        bookRepository.delete(book);
    }

    @Transactional
    public BookResponse updateBookStatus(Long id, BookStatus status) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id, ErrorCode.BOOK_NOT_FOUND));
        book.setStatus(status);
        bookRepository.save(book);
        return bookMapper.toResponse(book);
    }

    @Transactional
    public void recalculateRating(Long bookId) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book != null) {
            Double avg = reviewRepository.calculateAverageRating(bookId);
            Integer count = reviewRepository.countApprovedReviews(bookId);
            book.setAverageRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            book.setTotalRatings(count != null ? count : 0);
            book.setTotalReviews(count != null ? count : 0);
            bookRepository.save(book);
        }
    }

    @Transactional(readOnly = true)
    public RatingDistributionResponse getRatingDistribution(Long bookId) {
        List<Object[]> distribution = reviewRepository.getRatingDistribution(bookId);
        long star5 = 0, star4 = 0, star3 = 0, star2 = 0, star1 = 0;
        long total = 0;

        for (Object[] row : distribution) {
            int rating = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            total += count;
            switch (rating) {
                case 5 -> star5 = count;
                case 4 -> star4 = count;
                case 3 -> star3 = count;
                case 2 -> star2 = count;
                case 1 -> star1 = count;
            }
        }

        return RatingDistributionResponse.builder()
                .star5(star5).star4(star4).star3(star3).star2(star2).star1(star1)
                .total(total)
                .build();
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getTrendingBooks(Pageable pageable) {
        return bookMapper.toSummaryResponseList(bookRepository.findTrendingBooks(pageable));
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getTopRatedBooks(Pageable pageable) {
        return bookMapper.toSummaryResponseList(bookRepository.findTopRatedBooks(pageable));
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getNewReleases(Pageable pageable) {
        LocalDate ninetyDaysAgo = LocalDate.now().minusDays(90);
        return bookMapper.toSummaryResponseList(bookRepository.findNewReleases(ninetyDaysAgo, pageable));
    }
}
