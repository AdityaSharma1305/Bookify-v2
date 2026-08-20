package com.bookify.dto.response.collection;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private Integer bookCount;
    private LocalDateTime createdAt;
}
