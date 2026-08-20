package com.bookify.mapper;

import com.bookify.dto.response.notification.NotificationResponse;
import com.bookify.entity.Notification;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationResponse toResponse(Notification notification);
    List<NotificationResponse> toResponseList(List<Notification> notifications);
}
