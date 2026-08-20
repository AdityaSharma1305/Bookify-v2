import { apiClient } from './axiosInstance';
import {
  ApiResponse, PageResponse, AuthResponse, UserProfile,
  BookSummary, BookDetail, Category, Author, AuthorSummary,
  Review, FavoriteItem, CollectionItem, CollectionDetail,
  ReadingProgressItem, NotificationItem, UserDashboard,
  AdminStats, AdminAnalytics, BookStatus, ReadingStatus, ReviewStatus, UserStatus,
  ListingItem, OrderItem, PaymentIntentResponse, BookCondition, ListingStatus, OrderStatus
} from '../types';

export const api = {
  // Auth
  sendOtp: (email: string) =>
    apiClient.post<ApiResponse<string>>('/auth/send-otp', { email }),
  verifyOtpReset: (data: { email: string; otp: string; newPassword: string }) =>
    apiClient.post<ApiResponse<void>>('/auth/verify-otp-reset', data),
  googleLogin: (data: { email: string; name?: string; profileImage?: string }) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/google', data),
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<void>>('/auth/register', data),
  verifyEmail: (token: string) =>
    apiClient.get<ApiResponse<void>>(`/auth/verify-email?token=${token}`),
  resendVerification: (email: string) =>
    apiClient.post<ApiResponse<void>>('/auth/resend-verification', { email }),
  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),
  logout: (refreshToken: string) =>
    apiClient.post<ApiResponse<void>>('/auth/logout', { refreshToken }),
  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; newPassword: string }) =>
    apiClient.post<ApiResponse<void>>('/auth/reset-password', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post<ApiResponse<void>>('/auth/change-password', data),

  // User
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),
  updateProfile: (data: { name?: string; bio?: string; profileImage?: string; readingGoal?: number }) =>
    apiClient.put<ApiResponse<UserProfile>>('/users/me', data),
  getUserDashboard: () => apiClient.get<ApiResponse<UserDashboard>>('/users/me/dashboard'),

  // Books
  searchBooks: (params: {
    q?: string;
    genre?: string;
    author?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    language?: string;
    fromYear?: number;
    toYear?: number;
    page?: number;
    size?: number;
    sort?: string;
  }) => apiClient.get<ApiResponse<PageResponse<BookSummary>>>('/books', { params }),
  getBookDetails: (id: number) => apiClient.get<ApiResponse<BookDetail>>(`/books/${id}`),

  // Categories & Authors
  getCategories: () => apiClient.get<ApiResponse<Category[]>>('/categories'),
  getAuthors: (params?: { q?: string; page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<Author>>>('/authors', { params }),
  getTopAuthors: () => apiClient.get<ApiResponse<AuthorSummary[]>>('/authors/top'),
  getAuthorDetails: (id: number) => apiClient.get<ApiResponse<Author>>(`/authors/${id}`),
  getAuthorBooks: (id: number, page = 0, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<BookSummary>>>(`/authors/${id}/books`, { params: { page, size } }),

  // Reviews
  getBookReviews: (bookId: number, page = 0, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<Review>>>(`/reviews/book/${bookId}`, { params: { page, size } }),
  createReview: (bookId: number, data: { rating: number; title?: string; body?: string }) =>
    apiClient.post<ApiResponse<Review>>(`/reviews/book/${bookId}`, data),
  updateReview: (id: number, data: { rating: number; title?: string; body?: string }) =>
    apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data),
  deleteReview: (id: number) => apiClient.delete<ApiResponse<void>>(`/reviews/${id}`),
  markHelpful: (id: number) => apiClient.post<ApiResponse<void>>(`/reviews/${id}/helpful`),

  // Favorites
  getFavorites: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<FavoriteItem>>>('/favorites', { params: { page, size } }),
  toggleFavorite: (bookId: number) =>
    apiClient.post<ApiResponse<{ bookId: number; isFavorite: boolean }>>(`/favorites/${bookId}`),

  // Collections
  getCollections: () => apiClient.get<ApiResponse<CollectionItem[]>>('/collections'),
  getCollectionDetails: (id: number) => apiClient.get<ApiResponse<CollectionDetail>>(`/collections/${id}`),
  createCollection: (data: { name: string; description?: string; isPublic?: boolean }) =>
    apiClient.post<ApiResponse<CollectionItem>>('/collections', data),
  updateCollection: (id: number, data: { name: string; description?: string; isPublic?: boolean }) =>
    apiClient.put<ApiResponse<CollectionItem>>(`/collections/${id}`, data),
  deleteCollection: (id: number) => apiClient.delete<ApiResponse<void>>(`/collections/${id}`),
  addBookToCollection: (collectionId: number, bookId: number) =>
    apiClient.post<ApiResponse<void>>(`/collections/${collectionId}/books/${bookId}`),
  removeBookFromCollection: (collectionId: number, bookId: number) =>
    apiClient.delete<ApiResponse<void>>(`/collections/${collectionId}/books/${bookId}`),

  // Reading Progress
  getLibrary: (status?: ReadingStatus, page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<ReadingProgressItem>>>('/reading-progress', { params: { status, page, size } }),
  updateReadingStatus: (bookId: number, status: ReadingStatus) =>
    apiClient.post<ApiResponse<ReadingProgressItem>>(`/reading-progress/book/${bookId}/status`, { status }),
  updateReadingProgress: (bookId: number, currentPage: number, status?: ReadingStatus) =>
    apiClient.put<ApiResponse<ReadingProgressItem>>(`/reading-progress/book/${bookId}/progress`, { currentPage, status }),
  removeFromLibrary: (bookId: number) =>
    apiClient.delete<ApiResponse<void>>(`/reading-progress/book/${bookId}`),

  // Recommendations
  getPersonalizedRecs: (limit = 10) =>
    apiClient.get<ApiResponse<BookSummary[]>>('/recommendations', { params: { limit } }),
  getTrending: (limit = 10) =>
    apiClient.get<ApiResponse<BookSummary[]>>('/recommendations/trending', { params: { limit } }),
  getTopRated: (limit = 10) =>
    apiClient.get<ApiResponse<BookSummary[]>>('/recommendations/top-rated', { params: { limit } }),
  getNewReleases: (limit = 10) =>
    apiClient.get<ApiResponse<BookSummary[]>>('/recommendations/new-releases', { params: { limit } }),
  getBecauseYouRead: (bookId: number, limit = 6) =>
    apiClient.get<ApiResponse<BookSummary[]>>(`/recommendations/because-you-read/${bookId}`, { params: { limit } }),

  // Notifications
  getNotifications: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<NotificationItem>>>('/notifications', { params: { page, size } }),
  getUnreadNotifCount: () => apiClient.get<ApiResponse<number>>('/notifications/unread-count'),
  markNotifRead: (id: number) => apiClient.patch<ApiResponse<void>>(`/notifications/${id}/read`),
  markAllNotifsRead: () => apiClient.patch<ApiResponse<void>>('/notifications/read-all'),
  deleteNotif: (id: number) => apiClient.delete<ApiResponse<void>>(`/notifications/${id}`),

  // Image upload
  uploadImage: (formData: FormData, folder = 'books') =>
    apiClient.post<ApiResponse<{ url: string; publicId: string }>>(`/images/upload?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  
  // Marketplace & Listings
  getMarketplaceListings: (params?: { q?: string; condition?: string; page?: number; size?: number }) =>
    apiClient.get<ApiResponse<PageResponse<ListingItem>>>('/listings', { params }),
  getListingsForBook: (bookId: number) =>
    apiClient.get<ApiResponse<ListingItem[]>>(`/listings/book/${bookId}`),
  getMyListings: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<ListingItem>>>('/listings/me', { params: { page, size } }),
  createListing: (data: { bookId: number; conditionGrade: string; conditionDescription?: string; photoUrl?: string; listingPrice: number; shippingFee?: number }) =>
    apiClient.post<ApiResponse<ListingItem>>('/listings', data),
  deleteListing: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/listings/${id}`),

  // Orders & Payments
  checkoutOrder: (data: { listingId: number; shippingAddress: string }) =>
    apiClient.post<ApiResponse<PaymentIntentResponse>>('/orders/checkout', data),
  confirmOrderPaid: (orderId: number) =>
    apiClient.post<ApiResponse<OrderItem>>(`/orders/${orderId}/confirm-paid`),
  getPurchases: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<OrderItem>>>('/orders/purchases', { params: { page, size } }),
  getSales: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<OrderItem>>>('/orders/sales', { params: { page, size } }),
  markOrderShipped: (orderId: number, trackingNumber: string) =>
    apiClient.patch<ApiResponse<OrderItem>>(`/orders/${orderId}/ship?trackingNumber=${encodeURIComponent(trackingNumber)}`),
  markOrderDelivered: (orderId: number) =>
    apiClient.patch<ApiResponse<OrderItem>>(`/orders/${orderId}/delivered`),

  // Admin
  getAdminStats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/dashboard/stats'),
  getAdminAnalytics: () => apiClient.get<ApiResponse<AdminAnalytics>>('/admin/dashboard/analytics'),
  adminGetUsers: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<UserProfile>>>('/admin/users', { params: { page, size } }),
  adminUpdateUserStatus: (id: number, status: UserStatus) =>
    apiClient.patch<ApiResponse<UserProfile>>(`/admin/users/${id}/status?status=${status}`),
  adminCreateBook: (data: any) => apiClient.post<ApiResponse<BookSummary>>('/admin/books', data),
  adminUpdateBook: (id: number, data: any) => apiClient.put<ApiResponse<BookSummary>>(`/admin/books/${id}`, data),
  adminUpdateBookStatus: (id: number, status: BookStatus) =>
    apiClient.patch<ApiResponse<BookSummary>>(`/admin/books/${id}/status?status=${status}`),
  adminDeleteBook: (id: number) => apiClient.delete<ApiResponse<void>>(`/admin/books/${id}`),
  adminGetReviews: (status?: ReviewStatus, page = 0, size = 20) =>
    apiClient.get<ApiResponse<PageResponse<Review>>>('/admin/reviews', { params: { status, page, size } }),
  adminUpdateReviewStatus: (id: number, status: ReviewStatus) =>
    apiClient.patch<ApiResponse<Review>>(`/admin/reviews/${id}/status?status=${status}`),
  adminDeleteReview: (id: number) => apiClient.delete<ApiResponse<void>>(`/admin/reviews/${id}`),
};
