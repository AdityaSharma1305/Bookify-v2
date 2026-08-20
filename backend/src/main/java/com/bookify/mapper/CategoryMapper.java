package com.bookify.mapper;

import com.bookify.dto.request.category.CategoryCreateRequest;
import com.bookify.dto.request.category.CategoryUpdateRequest;
import com.bookify.dto.response.category.CategoryResponse;
import com.bookify.entity.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "books", ignore = true)
    Category toEntity(CategoryCreateRequest request);

    @Mapping(target = "bookCount", expression = "java(category.getBooks() != null ? category.getBooks().size() : 0)")
    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "books", ignore = true)
    void updateEntityFromRequest(CategoryUpdateRequest request, @MappingTarget Category category);
}
