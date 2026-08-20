package com.bookify.mapper;

import com.bookify.dto.request.book.BookCreateRequest;
import com.bookify.dto.request.book.BookUpdateRequest;
import com.bookify.dto.response.book.BookDetailResponse;
import com.bookify.dto.response.book.BookResponse;
import com.bookify.dto.response.book.BookSummaryResponse;
import com.bookify.entity.Book;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AuthorMapper.class, CategoryMapper.class})
public interface BookMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "totalRatings", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "favorites", ignore = true)
    @Mapping(target = "readingProgresses", ignore = true)
    Book toEntity(BookCreateRequest request);

    BookResponse toResponse(Book book);

    BookSummaryResponse toSummaryResponse(Book book);

    @Mapping(target = "recentReviews", ignore = true)
    @Mapping(target = "ratingDistribution", ignore = true)
    @Mapping(target = "relatedBooks", ignore = true)
    @Mapping(target = "otherBooksByAuthor", ignore = true)
    @Mapping(target = "isFavorite", ignore = true)
    @Mapping(target = "readingStatus", ignore = true)
    @Mapping(target = "currentPage", ignore = true)
    BookDetailResponse toDetailResponse(Book book);

    List<BookResponse> toResponseList(List<Book> books);

    List<BookSummaryResponse> toSummaryResponseList(List<Book> books);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "totalRatings", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "favorites", ignore = true)
    @Mapping(target = "readingProgresses", ignore = true)
    void updateEntityFromRequest(BookUpdateRequest request, @MappingTarget Book book);
}
