package com.bookify.repository;

import com.bookify.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    Optional<Category> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Category c LEFT JOIN c.books b GROUP BY c.id ORDER BY COUNT(b) DESC")
    List<Category> findPopularCategories();
}
