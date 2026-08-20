package com.bookify.service;

import com.bookify.dto.response.dashboard.AdminAnalyticsResponse;
import com.bookify.dto.response.dashboard.AdminStatsResponse;
import com.bookify.dto.response.dashboard.ChartDataPoint;
import com.bookify.dto.response.dashboard.UserDashboardResponse;
import com.bookify.entity.Category;
import com.bookify.entity.ReadingProgress;
import com.bookify.entity.ReadingStatus;
import com.bookify.entity.User;
import com.bookify.entity.UserStatus;
import com.bookify.exception.ErrorCode;
import com.bookify.exception.ResourceNotFoundException;
import com.bookify.mapper.BookMapper;
import com.bookify.mapper.ReadingProgressMapper;
import com.bookify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final CategoryRepository categoryRepository;
    private final ReadingProgressRepository readingProgressRepository;
    private final ReadingProgressMapper readingProgressMapper;
    private final BookMapper bookMapper;

    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", ErrorCode.USER_NOT_FOUND));

        long completedCount = readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.COMPLETED);
        long readingCount = readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.CURRENTLY_READING);
        long wantCount = readingProgressRepository.countByUserIdAndStatus(userId, ReadingStatus.WANT_TO_READ);
        long favCount = favoriteRepository.countByUserId(userId);
        Double avgRatingGiven = reviewRepository.calculateUserAverageRatingGiven(userId);

        List<ReadingProgress> currentList = readingProgressRepository.findByUserIdAndStatus(userId, ReadingStatus.CURRENTLY_READING, PageRequest.of(0, 5)).getContent();
        List<ReadingProgress> recentActivity = readingProgressRepository.findRecentActivityByUserId(userId, PageRequest.of(0, 5));

        int currentYear = LocalDate.now().getYear();
        List<Object[]> monthlyData = readingProgressRepository.getBooksReadPerMonth(userId, currentYear);
        Map<Integer, Long> monthlyMap = new HashMap<>();
        for (Object[] row : monthlyData) {
            monthlyMap.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }

        List<ChartDataPoint> monthlyChart = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            String monthName = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyChart.add(new ChartDataPoint(monthName, monthlyMap.getOrDefault(m, 0L)));
        }

        List<ReadingProgress> allRead = readingProgressRepository.findByUserId(userId, PageRequest.of(0, 100)).getContent();
        Map<String, Long> genreCounts = allRead.stream()
                .flatMap(rp -> rp.getBook().getCategories().stream())
                .collect(Collectors.groupingBy(Category::getName, Collectors.counting()));

        List<ChartDataPoint> genreDistribution = genreCounts.entrySet().stream()
                .map(e -> new ChartDataPoint(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getValue().longValue(), a.getValue().longValue()))
                .limit(6)
                .toList();

        return UserDashboardResponse.builder()
                .booksRead(completedCount)
                .currentlyReading(readingCount)
                .wantToRead(wantCount)
                .favoritesCount(favCount)
                .readingGoal(user.getReadingGoal() != null ? user.getReadingGoal() : 10)
                .averageRatingGiven(avgRatingGiven != null ? Math.round(avgRatingGiven * 10.0) / 10.0 : 0.0)
                .currentBooks(readingProgressMapper.toResponseList(currentList))
                .recentActivity(readingProgressMapper.toResponseList(recentActivity))
                .booksReadPerMonth(monthlyChart)
                .genreDistribution(genreDistribution)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        return AdminStatsResponse.builder()
                .totalBooks(bookRepository.count())
                .totalUsers(userRepository.count())
                .totalAuthors(authorRepository.count())
                .totalReviews(reviewRepository.count())
                .activeUsers(userRepository.countByStatus(UserStatus.ACTIVE))
                .booksAddedThisMonth(bookRepository.countBooksAddedSince(startOfMonth))
                .newUsersThisMonth(userRepository.countUsersRegisteredSince(startOfMonth))
                .build();
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAdminAnalytics() {
        var popularBooks = bookMapper.toSummaryResponseList(bookRepository.findTrendingBooks(PageRequest.of(0, 5)));
        var highestRated = bookMapper.toSummaryResponseList(bookRepository.findTopRatedBooks(PageRequest.of(0, 5)));

        List<Category> popularCategories = categoryRepository.findPopularCategories();
        List<ChartDataPoint> categoryPoints = popularCategories.stream()
                .limit(6)
                .map(c -> new ChartDataPoint(c.getName(), c.getBooks() != null ? c.getBooks().size() : 0))
                .toList();

        return AdminAnalyticsResponse.builder()
                .popularBooks(popularBooks)
                .highestRatedBooks(highestRated)
                .popularGenres(categoryPoints)
                .monthlyRegistrations(List.of())
                .monthlyBookAdditions(List.of())
                .build();
    }
}
