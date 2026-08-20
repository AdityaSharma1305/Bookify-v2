package com.bookify.dto.response.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingDistributionResponse {
    private Long star5;
    private Long star4;
    private Long star3;
    private Long star2;
    private Long star1;
    private Long total;

    public int getPercentage(int star) {
        if (total == null || total == 0) return 0;
        long count = switch (star) {
            case 5 -> star5 != null ? star5 : 0;
            case 4 -> star4 != null ? star4 : 0;
            case 3 -> star3 != null ? star3 : 0;
            case 2 -> star2 != null ? star2 : 0;
            case 1 -> star1 != null ? star1 : 0;
            default -> 0;
        };
        return (int) Math.round(((double) count / total) * 100);
    }
}
