package com.bookify.mapper;

import com.bookify.dto.response.marketplace.OrderResponse;
import com.bookify.entity.Order;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookListingMapper.class})
public interface OrderMapper {
    OrderResponse toResponse(Order order);
    List<OrderResponse> toResponseList(List<Order> orders);
}
