package com.bookify.mapper;

import com.bookify.dto.request.collection.CollectionCreateRequest;
import com.bookify.dto.request.collection.CollectionUpdateRequest;
import com.bookify.dto.response.collection.CollectionDetailResponse;
import com.bookify.dto.response.collection.CollectionResponse;
import com.bookify.entity.Collection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface CollectionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "collectionBooks", ignore = true)
    Collection toEntity(CollectionCreateRequest request);

    @Mapping(target = "bookCount", expression = "java(collection.getCollectionBooks() != null ? collection.getCollectionBooks().size() : 0)")
    CollectionResponse toResponse(Collection collection);

    @Mapping(target = "books", ignore = true)
    @Mapping(target = "bookCount", expression = "java(collection.getCollectionBooks() != null ? collection.getCollectionBooks().size() : 0)")
    CollectionDetailResponse toDetailResponse(Collection collection);

    List<CollectionResponse> toResponseList(List<Collection> collections);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "collectionBooks", ignore = true)
    void updateEntityFromRequest(CollectionUpdateRequest request, @MappingTarget Collection collection);
}
