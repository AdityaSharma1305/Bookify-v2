package com.bookify.mapper;

import com.bookify.dto.request.author.AuthorCreateRequest;
import com.bookify.dto.request.author.AuthorUpdateRequest;
import com.bookify.dto.response.author.AuthorResponse;
import com.bookify.dto.response.author.AuthorSummaryResponse;
import com.bookify.entity.Author;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    Author toEntity(AuthorCreateRequest request);

    @Mapping(target = "bookCount", expression = "java(author.getBooks() != null ? author.getBooks().size() : 0)")
    AuthorResponse toResponse(Author author);

    AuthorSummaryResponse toSummaryResponse(Author author);

    List<AuthorResponse> toResponseList(List<Author> authors);

    List<AuthorSummaryResponse> toSummaryResponseList(List<Author> authors);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    void updateEntityFromRequest(AuthorUpdateRequest request, @MappingTarget Author author);
}
