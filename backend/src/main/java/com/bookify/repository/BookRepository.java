package com.bookify.repository;

import com.bookify.entity.Book;
import com.bookify.entity.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    Page<Book> findByStatus(BookStatus status, Pageable pageable);
    Page<Book> findByAuthorId(Long authorId, Pageable pageable);

    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN b.author a " +
            "LEFT JOIN b.categories c " +
            "WHERE (:status IS NULL OR b.status = :status) " +
            "AND (:query IS NULL OR :query = '' OR " +
            "     LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "     LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "     LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "     LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:genre IS NULL OR :genre = '' OR LOWER(c.name) = LOWER(:genre) OR LOWER(c.slug) = LOWER(:genre)) " +
            "AND (:authorName IS NULL OR :authorName = '' OR LOWER(a.name) LIKE LOWER(CONCAT('%', :authorName, '%'))) " +
            "AND (:minRating IS NULL OR b.averageRating >= :minRating) " +
            "AND (:minPrice IS NULL OR b.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR b.price <= :maxPrice) " +
            "AND (:language IS NULL OR :language = '' OR LOWER(b.language) = LOWER(:language)) " +
            "AND (:fromYear IS NULL OR YEAR(b.publicationDate) >= :fromYear) " +
            "AND (:toYear IS NULL OR YEAR(b.publicationDate) <= :toYear)")
    Page<Book> searchBooks(
            @Param("status") BookStatus status,
            @Param("query") String query,
            @Param("genre") String genre,
            @Param("authorName") String authorName,
            @Param("minRating") BigDecimal minRating,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("language") String language,
            @Param("fromYear") Integer fromYear,
            @Param("toYear") Integer toYear,
            Pageable pageable
    );

    @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' ORDER BY b.averageRating DESC, b.totalRatings DESC")
    List<Book> findTopRatedBooks(Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' AND b.publicationDate >= :sinceDate ORDER BY b.publicationDate DESC")
    List<Book> findNewReleases(@Param("sinceDate") LocalDate sinceDate, Pageable pageable);

    @Query("SELECT b FROM Book b JOIN b.favorites f WHERE b.status = 'ACTIVE' GROUP BY b.id ORDER BY COUNT(f) DESC")
    List<Book> findTrendingBooks(Pageable pageable);

    @Query("SELECT DISTINCT b FROM Book b JOIN b.categories c WHERE b.status = 'ACTIVE' AND c.id IN :categoryIds AND b.id <> :excludeBookId ORDER BY b.averageRating DESC")
    List<Book> findSimilarBooks(@Param("categoryIds") Set<Long> categoryIds, @Param("excludeBookId") Long excludeBookId, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' AND b.author.id = :authorId AND b.id <> :excludeBookId")
    List<Book> findOtherBooksByAuthor(@Param("authorId") Long authorId, @Param("excludeBookId") Long excludeBookId, Pageable pageable);

    @Query("SELECT DISTINCT b FROM Book b JOIN b.categories c WHERE b.status = 'ACTIVE' AND c.id IN :categoryIds AND b.id NOT IN :readBookIds ORDER BY b.averageRating DESC")
    List<Book> findRecommendedForUserCategories(@Param("categoryIds") Set<Long> categoryIds, @Param("readBookIds") Set<Long> readBookIds, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.createdAt >= :startDate")
    long countBooksAddedSince(@Param("startDate") LocalDateTime startDate);
}
