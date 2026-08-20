package com.bookify.mapper;

import com.bookify.dto.request.marketplace.ListingCreateRequest;
import com.bookify.dto.response.marketplace.ListingResponse;
import com.bookify.entity.BookListing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface BookListingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "originalPrice", ignore = true)
    BookListing toEntity(ListingCreateRequest request);

    @Mapping(target = "discountPercentage", expression = "java(calculateDiscount(listing))")
    ListingResponse toResponse(BookListing listing);

    List<ListingResponse> toResponseList(List<BookListing> listings);

    default Integer calculateDiscount(BookListing listing) {
        if (listing == null || listing.getOriginalPrice() == null || listing.getListingPrice() == null) {
            return 0;
        }
        if (listing.getOriginalPrice().compareTo(BigDecimal.ZERO) <= 0) return 0;
        BigDecimal diff = listing.getOriginalPrice().subtract(listing.getListingPrice());
        if (diff.compareTo(BigDecimal.ZERO) <= 0) return 0;
        return diff.divide(listing.getOriginalPrice(), 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).intValue();
    }
}
