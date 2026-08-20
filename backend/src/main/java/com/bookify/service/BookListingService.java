package com.bookify.service;

import com.bookify.dto.request.marketplace.ListingCreateRequest;
import com.bookify.dto.response.marketplace.ListingResponse;
import com.bookify.entity.*;
import com.bookify.exception.*;
import com.bookify.mapper.BookListingMapper;
import com.bookify.repository.BookListingRepository;
import com.bookify.repository.BookRepository;
import com.bookify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookListingService {

    private final BookListingRepository bookListingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookListingMapper listingMapper;

    @Transactional(readOnly = true)
    public Page<ListingResponse> getMarketplaceListings(String query, BookCondition condition, Pageable pageable) {
        return bookListingRepository.searchMarketplace(query, condition, pageable).map(listingMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getListingsForBook(Long bookId) {
        return listingMapper.toResponseList(bookListingRepository.findByBookIdAndStatus(bookId, ListingStatus.AVAILABLE));
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> getSellerListings(Long sellerId, Pageable pageable) {
        return bookListingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable).map(listingMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ListingResponse getListingById(Long id) {
        BookListing listing = bookListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id, ErrorCode.RESOURCE_NOT_FOUND));
        return listingMapper.toResponse(listing);
    }

    @Transactional
    public ListingResponse createListing(Long sellerId, ListingCreateRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found", ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found", ErrorCode.BOOK_NOT_FOUND));

        BookListing listing = listingMapper.toEntity(request);
        listing.setSeller(seller);
        listing.setBook(book);
        listing.setOriginalPrice(book.getPrice());
        listing.setStatus(ListingStatus.AVAILABLE);

        bookListingRepository.save(listing);
        return listingMapper.toResponse(listing);
    }

    @Transactional
    public void deleteListing(Long userId, Long listingId, boolean isAdmin) {
        BookListing listing = bookListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found", ErrorCode.RESOURCE_NOT_FOUND));

        if (!isAdmin && !listing.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("You can only remove your own listings");
        }

        listing.setStatus(ListingStatus.DELISTED);
        bookListingRepository.save(listing);
    }
}
