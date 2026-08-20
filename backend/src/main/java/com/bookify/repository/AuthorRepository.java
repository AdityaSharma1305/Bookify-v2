package com.bookify.repository;

import com.bookify.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findByName(String name);

    Page<Author> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT a FROM Author a LEFT JOIN a.books b GROUP BY a.id ORDER BY COUNT(b) DESC")
    List<Author> findTopAuthorsWithMostBooks(Pageable pageable);
}
