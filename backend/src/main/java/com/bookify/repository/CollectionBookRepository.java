package com.bookify.repository;

import com.bookify.entity.CollectionBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollectionBookRepository extends JpaRepository<CollectionBook, Long> {
    Optional<CollectionBook> findByCollectionIdAndBookId(Long collectionId, Long bookId);
    boolean existsByCollectionIdAndBookId(Long collectionId, Long bookId);
    void deleteByCollectionIdAndBookId(Long collectionId, Long bookId);
    Page<CollectionBook> findByCollectionIdOrderByAddedAtDesc(Long collectionId, Pageable pageable);
    long countByCollectionId(Long collectionId);
}
