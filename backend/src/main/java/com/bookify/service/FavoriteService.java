package com.bookify.service;

import com.bookify.dto.response.favorite.FavoriteResponse;
import com.bookify.dto.response.favorite.FavoriteStatusResponse;
import com.bookify.entity.Book;
import com.bookify.entity.Favorite;
import com.bookify.entity.User;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.BookMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.FavoriteRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Transactional(readOnly = true)
    public Page<FavoriteResponse> getUserFavorites(Long userId, Pageable pageable) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(fav -> FavoriteResponse.builder()
                        .id(fav.getId())
                        .book(bookMapper.toSummaryResponse(fav.getBook()))
                        .createdAt(fav.getCreatedAt())
                        .build());
    }

    @Transactional
    public FavoriteStatusResponse toggleFavorite(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        if (favoriteRepository.existsByUserIdAndBookId(userId, bookId)) {
            favoriteRepository.deleteByUserIdAndBookId(userId, bookId);
            return FavoriteStatusResponse.builder().bookId(bookId).isFavorite(false).build();
        } else {
            Favorite favorite = Favorite.builder().user(user).book(book).build();
            favoriteRepository.save(favorite);
            return FavoriteStatusResponse.builder().bookId(bookId).isFavorite(true).build();
        }
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse checkFavoriteStatus(Long userId, Long bookId) {
        boolean isFav = favoriteRepository.existsByUserIdAndBookId(userId, bookId);
        return FavoriteStatusResponse.builder().bookId(bookId).isFavorite(isFav).build();
    }
}
