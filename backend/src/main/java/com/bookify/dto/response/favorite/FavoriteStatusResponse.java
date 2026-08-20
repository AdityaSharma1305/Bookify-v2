package com.bookify.dto.response.favorite;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteStatusResponse {
    private Long bookId;
    private Boolean isFavorite;
}
