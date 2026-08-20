package com.bookify.service;

import com.bookify.dto.request.collection.CollectionCreateRequest;
import com.bookify.dto.request.collection.CollectionUpdateRequest;
import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.dto.response.collection.CollectionDetailResponse;
import com.bookify.dto.response.collection.CollectionResponse;
import com.bookify.entity.Book;
import com.bookify.entity.Collection;
import com.bookify.entity.CollectionBook;
import com.bookify.entity.User;
import com.bookify.exception.*;
import com.bookify.mapper.BookMapper;
import com.bookify.mapper.CollectionMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.CollectionBookRepository;
import com.bookify.repository.CollectionRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final CollectionBookRepository collectionBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CollectionMapper collectionMapper;
    private final BookMapper bookMapper;

    @Transactional(readOnly = true)
    public List<CollectionResponse> getUserCollections(Long userId) {
        return collectionMapper.toResponseList(collectionRepository.findByUserIdOrderByNameAsc(userId));
    }

    @Transactional(readOnly = true)
    public CollectionDetailResponse getCollectionDetails(Long userId, Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found", ErrorCode.COLLECTION_NOT_FOUND));

        if (!collection.getUser().getId().equals(userId) && !Boolean.TRUE.equals(collection.getIsPublic())) {
            throw new ForbiddenException("You cannot view this private collection");
        }

        CollectionDetailResponse response = collectionMapper.toDetailResponse(collection);
        List<BookSummaryResponse> books = collection.getCollectionBooks().stream()
                .map(cb -> bookMapper.toSummaryResponse(cb.getBook()))
                .toList();
        response.setBooks(books);
        return response;
    }

    @Transactional
    public CollectionResponse createCollection(Long userId, CollectionCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        if (collectionRepository.existsByNameIgnoreCaseAndUserId(request.getName().trim(), userId)) {
            throw new DuplicateResourceException("You already have a collection with this name");
        }

        Collection collection = collectionMapper.toEntity(request);
        collection.setUser(user);
        collection.setName(request.getName().trim());
        collectionRepository.save(collection);

        return collectionMapper.toResponse(collection);
    }

    @Transactional
    public CollectionResponse updateCollection(Long userId, Long collectionId, CollectionUpdateRequest request) {
        Collection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found", ErrorCode.COLLECTION_NOT_FOUND));

        collectionMapper.updateEntityFromRequest(request, collection);
        collection.setName(request.getName().trim());
        collectionRepository.save(collection);

        return collectionMapper.toResponse(collection);
    }

    @Transactional
    public void deleteCollection(Long userId, Long collectionId) {
        Collection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found", ErrorCode.COLLECTION_NOT_FOUND));
        collectionRepository.delete(collection);
    }

    @Transactional
    public void addBookToCollection(Long userId, Long collectionId, Long bookId) {
        Collection collection = collectionRepository.findByIdAndUserId(collectionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found", ErrorCode.COLLECTION_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        if (collectionBookRepository.existsByCollectionIdAndBookId(collectionId, bookId)) {
            throw new DuplicateResourceException("Book is already in this collection");
        }

        CollectionBook collectionBook = CollectionBook.builder()
                .collection(collection)
                .book(book)
                .build();
        collectionBookRepository.save(collectionBook);
    }

    @Transactional
    public void removeBookFromCollection(Long userId, Long collectionId, Long bookId) {
        if (!collectionRepository.existsById(collectionId)) {
            throw new ResourceNotFoundException("Collection not found", ErrorCode.COLLECTION_NOT_FOUND);
        }
        collectionBookRepository.deleteByCollectionIdAndBookId(collectionId, bookId);
    }
}
