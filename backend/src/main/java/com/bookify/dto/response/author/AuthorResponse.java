package com.bookify.dto.response.author;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorResponse {
    private Long id;
    private String name;
    private String biography;
    private String country;
    private LocalDate dateOfBirth;
    private String profileImage;
    private String website;
    private Integer bookCount;
}
