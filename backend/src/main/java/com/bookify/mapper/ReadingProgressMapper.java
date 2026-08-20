package com.bookify.mapper;

import com.bookify.dto.response.reading.ReadingProgressResponse;
import com.bookify.entity.ReadingProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface ReadingProgressMapper {

    @Mapping(target = "totalPages", expression = "java(progress.getBook() != null && progress.getBook().getPageCount() != null ? progress.getBook().getPageCount() : 0)")
    @Mapping(target = "percentage", expression = "java(calculatePercentage(progress))")
    ReadingProgressResponse toResponse(ReadingProgress progress);

    List<ReadingProgressResponse> toResponseList(List<ReadingProgress> progressList);

    default Integer calculatePercentage(ReadingProgress progress) {
        if (progress == null || progress.getBook() == null || progress.getBook().getPageCount() == null || progress.getBook().getPageCount() == 0) {
            return 0;
        }
        int current = progress.getCurrentPage() != null ? progress.getCurrentPage() : 0;
        int total = progress.getBook().getPageCount();
        return Math.min(100, (int) Math.round(((double) current / total) * 100));
    }
}
