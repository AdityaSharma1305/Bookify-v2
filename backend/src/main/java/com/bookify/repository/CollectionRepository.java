package com.bookify.repository;

import com.bookify.entity.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserIdOrderByNameAsc(Long userId);
    Page<Collection> findByUserId(Long userId, Pageable pageable);
    Optional<Collection> findByIdAndUserId(Long id, Long userId);
    boolean existsByNameIgnoreCaseAndUserId(String name, Long userId);
}
