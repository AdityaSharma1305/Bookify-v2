package com.bookify.service;

import com.bookify.dto.request.book.BookCreateRequest;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.entity.Author;
import com.bookify.entity.Book;
import com.bookify.entity.BookStatus;
import com.bookify.exception.DuplicateResourceException;
import com.bookify.mapper.BookMapper;
import com.bookify.mapper.ReviewMapper;
import com.bookify.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock private BookRepository bookRepository;
    @Mock private AuthorRepository authorRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private FavoriteRepository favoriteRepository;
    @Mock private ReadingProgressRepository readingProgressRepository;
    @Mock private BookMapper bookMapper;
    @Mock private ReviewMapper reviewMapper;

    @InjectMocks private BookService bookService;

    private Book sampleBook;
    private Author sampleAuthor;

    @BeforeEach
    void setUp() {
        sampleAuthor = Author.builder().id(1L).name("Author Name").build();
        sampleBook = Book.builder()
                .id(1L)
                .title("Clean Code")
                .isbn("9780132350884")
                .author(sampleAuthor)
                .averageRating(BigDecimal.valueOf(4.5))
                .status(BookStatus.ACTIVE)
                .build();
    }

    @Test
    void createBook_Success() {
        BookCreateRequest request = BookCreateRequest.builder()
                .title("Clean Code")
                .isbn("9780132350884")
                .authorId(1L)
                .categoryIds(Set.of())
                .build();

        when(bookRepository.existsByIsbn("9780132350884")).thenReturn(false);
        when(authorRepository.findById(1L)).thenReturn(Optional.of(sampleAuthor));
        when(bookMapper.toEntity(request)).thenReturn(sampleBook);
        when(bookMapper.toResponse(any(Book.class))).thenReturn(BookResponse.builder().id(1L).title("Clean Code").build());

        BookResponse response = bookService.createBook(request);
        assertNotNull(response);
        assertEquals("Clean Code", response.getTitle());
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    void createBook_DuplicateIsbn_ThrowsException() {
        BookCreateRequest request = BookCreateRequest.builder().isbn("9780132350884").build();
        when(bookRepository.existsByIsbn("9780132350884")).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> bookService.createBook(request));
    }

    @Test
    void recalculateRating_UpdatesAverageAndCount() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(sampleBook));
        when(reviewRepository.calculateAverageRating(1L)).thenReturn(4.75);
        when(reviewRepository.countApprovedReviews(1L)).thenReturn(12);

        bookService.recalculateRating(1L);

        verify(bookRepository).save(sampleBook);
        assertEquals(BigDecimal.valueOf(4.75), sampleBook.getAverageRating());
        assertEquals(12, sampleBook.getTotalRatings());
    }
}
