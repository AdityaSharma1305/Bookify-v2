package com.bookify.service;

import com.bookify.dto.request.author.AuthorCreateRequest;
import com.bookify.dto.request.author.AuthorUpdateRequest;
import com.bookify.dto.response.author.AuthorResponse;
import com.bookify.dto.response.author.AuthorSummaryResponse;
import com.bookify.entity.Author;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.AuthorMapper;
import com.bookify.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    @Transactional(readOnly = true)
    public Page<AuthorResponse> getAllAuthors(String query, Pageable pageable) {
        if (query != null && !query.isBlank()) {
            return authorRepository.findByNameContainingIgnoreCase(query, pageable).map(authorMapper::toResponse);
        }
        return authorRepository.findAll(pageable).map(authorMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id, ErrorCode.AUTHOR_NOT_FOUND));
        return authorMapper.toResponse(author);
    }

    @Transactional(readOnly = true)
    public List<AuthorSummaryResponse> getTopAuthors(Pageable pageable) {
        return authorMapper.toSummaryResponseList(authorRepository.findTopAuthorsWithMostBooks(pageable));
    }

    @Transactional
    public AuthorResponse createAuthor(AuthorCreateRequest request) {
        Author author = authorMapper.toEntity(request);
        authorRepository.save(author);
        return authorMapper.toResponse(author);
    }

    @Transactional
    public AuthorResponse updateAuthor(Long id, AuthorUpdateRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id, ErrorCode.AUTHOR_NOT_FOUND));

        authorMapper.updateEntityFromRequest(request, author);
        authorRepository.save(author);
        return authorMapper.toResponse(author);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Author not found with id: " + id, ErrorCode.AUTHOR_NOT_FOUND);
        }
        authorRepository.deleteById(id);
    }
}
