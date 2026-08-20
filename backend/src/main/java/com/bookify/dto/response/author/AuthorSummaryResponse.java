package com.bookify.dto.response.author;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorSummaryResponse {
    private Long id;
    private String name;
    private String country;
    private String profileImage;
}
