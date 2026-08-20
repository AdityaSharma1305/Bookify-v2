package com.bookify.dto.response.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartDataPoint {
    private String label;
    private Number value;
}
