package com.bookify.service;

import com.bookify.dto.request.user.UserProfileUpdateRequest;
import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.dto.response.user.UserProfileResponse;
import com.bookify.entity.ReadingStatus;
import com.bookify.entity.User;
import com.bookify.entity.UserStatus;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.UserMapper;
import com.bookify.repository.FavoriteRepository;
import com.bookify.repository.ReadingProgressRepository;
import com.bookify.repository.ReviewRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ReadingProgressRepository readingProgressRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        UserProfileResponse response = userMapper.toProfileResponse(user);
        response.setBooksReadCount(readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.COMPLETED));
        response.setCurrentlyReadingCount(readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.CURRENTLY_READING));
        response.setWantToReadCount(readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.WANT_TO_READ));
        response.setFavoritesCount(favoriteRepository.countByUserId(userId));
        response.setReviewsCount((long) user.getReviews().size());
        return response;
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (request.getReadingGoal() != null) {
            user.setReadingGoal(request.getReadingGoal());
        }

        userRepository.save(user);
        return getUserProfile(userId);
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toSummaryResponse);
    }

    @Transactional
    public UserSummaryResponse updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
        user.setStatus(status);
        userRepository.save(user);
        return userMapper.toSummaryResponse(user);
    }
}
