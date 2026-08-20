package com.bookify.mapper;

import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.dto.response.user.UserProfileResponse;
import com.bookify.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserSummaryResponse toSummaryResponse(User user);

    @Mapping(target = "booksReadCount", ignore = true)
    @Mapping(target = "currentlyReadingCount", ignore = true)
    @Mapping(target = "wantToReadCount", ignore = true)
    @Mapping(target = "favoritesCount", ignore = true)
    @Mapping(target = "reviewsCount", ignore = true)
    UserProfileResponse toProfileResponse(User user);

    List<UserSummaryResponse> toSummaryResponseList(List<User> users);
}
