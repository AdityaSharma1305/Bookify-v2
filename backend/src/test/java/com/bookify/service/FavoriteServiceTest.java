package com.bookify.service;

import com.bookify.dto.response.favorite.FavoriteStatusResponse;
import com.bookify.entity.Book;
import com.bookify.entity.Favorite;
import com.bookify.entity.User;
import com.bookify.mapper.BookMapper;
import com.bookify.repository.BookRepository;
import com.bookify.repository.FavoriteRepository;
import com.bookify.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock private FavoriteRepository favoriteRepository;
    @Mock private UserRepository userRepository;
    @Mock private BookRepository bookRepository;
    @Mock private BookMapper bookMapper;

    @InjectMocks private FavoriteService favoriteService;

    @Test
    void toggleFavorite_AddFavorite() {
        User user = User.builder().id(1L).build();
        Book book = Book.builder().id(10L).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
        when(favoriteRepository.existsByUserIdAndBookId(1L, 10L)).thenReturn(false);

        FavoriteStatusResponse response = favoriteService.toggleFavorite(1L, 10L);
        assertTrue(response.getIsFavorite());
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void toggleFavorite_RemoveFavorite() {
        User user = User.builder().id(1L).build();
        Book book = Book.builder().id(10L).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
        when(favoriteRepository.existsByUserIdAndBookId(1L, 10L)).thenReturn(true);

        FavoriteStatusResponse response = favoriteService.toggleFavorite(1L, 10L);
        assertFalse(response.getIsFavorite());
        verify(favoriteRepository).deleteByUserIdAndBookId(1L, 10L);
    }
}
