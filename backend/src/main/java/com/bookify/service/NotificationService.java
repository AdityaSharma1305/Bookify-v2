package com.bookify.service;

import com.bookify.dto.response.notification.NotificationResponse;
import com.bookify.entity.Notification;
import com.bookify.entity.NotificationType;
import com.bookify.entity.User;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.NotificationMapper;
import com.bookify.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type, String actionUrl) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .actionUrl(actionUrl)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found", ErrorCode.RESOURCE_NOT_FOUND));
        if (notification.getUser().getId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    public void deleteNotification(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found", ErrorCode.RESOURCE_NOT_FOUND));
        if (notification.getUser().getId().equals(userId)) {
            notificationRepository.delete(notification);
        }
    }
}
