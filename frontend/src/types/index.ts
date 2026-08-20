export type Role = 'ROLE_USER' | 'ROLE_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type BookStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type ReadingStatus = 'WANT_TO_READ' | 'CURRENTLY_READING' | 'COMPLETED' | 'ABANDONED';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type NotificationType = 'SYSTEM' | 'REVIEW' | 'WISHLIST' | 'MILESTONE' | 'SECURITY' | 'RECOMMENDATION';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  profileImage?: string;
  readingGoal?: number;
}

export interface UserProfile extends UserSummary {
  bio?: string;
  booksReadCount: number;
  currentlyReadingCount: number;
  wantToReadCount: number;
  favoritesCount: number;
  reviewsCount: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  bookCount?: number;
}

export interface AuthorSummary {
  id: number;
  name: string;
  country?: string;
  profileImage?: string;
}

export interface Author extends AuthorSummary {
  biography?: string;
  dateOfBirth?: string;
  website?: string;
  bookCount?: number;
}

export interface BookSummary {
  id: number;
  isbn: string;
  title: string;
  subtitle?: string;
  author: AuthorSummary;
  coverImage?: string;
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  price?: number;
  status: BookStatus;
  categories: Category[];
}

export interface BookDetail extends BookSummary {
  description?: string;
  publisher?: string;
  publicationDate?: string;
  language?: string;
  pageCount?: number;
  recentReviews?: Review[];
  ratingDistribution?: RatingDistribution;
  relatedBooks?: BookSummary[];
  otherBooksByAuthor?: BookSummary[];
  isFavorite?: boolean;
  readingStatus?: ReadingStatus;
  currentPage?: number;
  createdAt: string;
}

export interface Review {
  id: number;
  bookId: number;
  bookTitle?: string;
  user: UserSummary;
  rating: number;
  title?: string;
  body?: string;
  helpfulCount: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface RatingDistribution {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
  total: number;
}

export interface FavoriteItem {
  id: number;
  book: BookSummary;
  createdAt: string;
}

export interface CollectionItem {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  bookCount: number;
  createdAt: string;
}

export interface CollectionDetail extends CollectionItem {
  books: BookSummary[];
}

export interface ReadingProgressItem {
  id: number;
  book: BookSummary;
  status: ReadingStatus;
  currentPage: number;
  totalPages: number;
  percentage: number;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface UserDashboard {
  booksRead: number;
  currentlyReading: number;
  wantToRead: number;
  favoritesCount: number;
  readingGoal: number;
  averageRatingGiven: number;
  currentBooks: ReadingProgressItem[];
  recentActivity: ReadingProgressItem[];
  booksReadPerMonth: ChartDataPoint[];
  genreDistribution: ChartDataPoint[];
}

export interface AdminStats {
  totalBooks: number;
  totalUsers: number;
  totalAuthors: number;
  totalReviews: number;
  activeUsers: number;
  booksAddedThisMonth: number;
  newUsersThisMonth: number;
}

export interface AdminAnalytics {
  popularBooks: BookSummary[];
  highestRatedBooks: BookSummary[];
  popularGenres: ChartDataPoint[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export type BookCondition = 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DELISTED';
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export interface ListingItem {
  id: number;
  seller: UserSummary;
  book: BookSummary;
  conditionGrade: BookCondition;
  conditionDescription?: string;
  photoUrl?: string;
  listingPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  shippingFee: number;
  status: ListingStatus;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderNumber: string;
  buyer: UserSummary;
  seller: UserSummary;
  listing: ListingItem;
  totalAmount: number;
  shippingAddress: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey?: string;
  orderId: number;
  orderNumber: string;
  amount: number;
  currency: string;
}
