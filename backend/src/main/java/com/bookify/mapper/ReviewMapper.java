package com.bookify.mapper;

import com.bookify.dto.request.review.ReviewCreateRequest;
import com.bookify.dto.request.review.ReviewUpdateRequest;
import com.bookify.dto.response.review.ReviewResponse;
import com.bookify.entity.Review;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "status", ignore = true)
    Review toEntity(ReviewCreateRequest request);

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    ReviewResponse toResponse(Review review);

    List<ReviewResponse> toResponseList(List<Review> reviews);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromRequest(ReviewUpdateRequest request, @MappingTarget Review review);
}
