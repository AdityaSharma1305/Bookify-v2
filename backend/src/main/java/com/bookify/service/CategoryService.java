package com.bookify.service;

import com.bookify.dto.request.category.CategoryCreateRequest;
import com.bookify.dto.request.category.CategoryUpdateRequest;
import com.bookify.dto.response.category.CategoryResponse;
import com.bookify.entity.Category;
import com.bookify.exception.DuplicateResourceException;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.CategoryMapper;
import com.bookify.repository.CategoryRepository;
import com.bookify.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryMapper.toResponseList(categoryRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id, ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new DuplicateResourceException("Category with this name already exists", ErrorCode.DUPLICATE_RESOURCE);
        }

        Category category = categoryMapper.toEntity(request);
        category.setName(request.getName().trim());
        category.setSlug(SlugUtils.toSlug(request.getName()));
        categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id, ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.updateEntityFromRequest(request, category);
        category.setName(request.getName().trim());
        category.setSlug(SlugUtils.toSlug(request.getName()));
        categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id, ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }
}
