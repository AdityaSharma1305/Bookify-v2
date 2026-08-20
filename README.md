# 📚 Bookify — Curated Literary Stacks & Pre-Loved Marketplace

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 22](https://img.shields.io/badge/Java-22-orange.svg)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Resend](https://img.shields.io/badge/Email-Resend%20SMTP-black.svg)](https://resend.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Bookify** is a luxury, production-grade literary ecosystem and peer-to-peer pre-loved book marketplace designed and engineered by **Aditya Sharma**. It combines an Obsidian & Gold editorial aesthetic with enterprise-grade security, live reading telemetry, escrow-protected marketplace transactions, and instant transactional email automation.

---

## 👨‍💻 Creator & Engineering Attribution
* **Creator & Lead Developer**: **Aditya Sharma**
* **Product Vision**: A personal, non-corporate, reader-first ecosystem for book lovers, collectors, and bibliophiles.

---

## ✨ Key Features & Architecture Highlights

### 1. 🛡️ Enterprise Security & Authentication Engine
* **6-Criteria Password Security Engine**:
  * Real-time interactive strength meter and visual checklist enforcing 8+ characters, uppercase (`A-Z`), lowercase (`a-z`), numeric digits (`0-9`), special symbols (`!@#$%^&*`), and confirmation matching.
* **Disposable / Fake Email Domain Blocker**:
  * Proactive server-side rejection of temporary or disposable email addresses (`tempmail`, `mailinator`, `10minutemail`, `yopmail`, `fake.com`, etc.) to guarantee real user identity.
* **Google One-Tap & OAuth 2.0**:
  * Fast, verified Google identity sign-in integration with automatic profile ingestion.
* **JWT Token Security & Auto-Rotation**:
  * 15-minute stateless JWT access tokens + 7-day cryptographically secure refresh tokens with automatic token rotation and revocation.
* **Instant Resend Email Automation**:
  * Asynchronous dispatch of luxury obsidian & gold **Welcome Emails** and **6-Digit Password Reset OTPs** via Resend SMTP.

### 2. 📖 Editorial 3D UI & Digital Library
* **Hardcover 3D Spine & Gloss Aesthetics**:
  * Books rendered with authentic publisher binding textures, gold category badges, and hover lift physics.
* **Curated Literary Stacks**:
  * Multi-faceted filtering across fiction, startup classics, technology, philosophy, and memoirs with INR (`₹`) pricing.
* **Personal Reading Velocity Tracker**:
  * Interactive shelf tabs (*Currently Reading*, *Want to Read*, *Completed*, *Favorites*), daily page progress tracking, and an annual reading challenge thermometer.

### 3. 🛍️ Pre-Loved Escrow Marketplace
* **Peer-to-Peer Book Listings**:
  * Verified condition ratings (**Like New**, **Very Good**, **Good**, **Acceptable**) at up to 70% off publisher retail.
* **100% Escrow Buyer Protection**:
  * Payments and orders held securely in escrow until physical delivery is confirmed.
* **Real-time Order Tracking Timeline**:
  * Stage-by-stage visual tracking (*Escrow Secured* ➔ *Shipped* ➔ *Delivered*).

---

## 🏛️ System Architecture

```
Bookify/
├── backend/                       # Spring Boot 3 REST API (Java 22)
│   ├── src/main/java/com/bookify/
│   │   ├── config/                # Security, CORS, OpenAPI, Resend Mail
│   │   ├── security/              # JWT Token Provider, Auth Filter, UserPrincipal
│   │   ├── entity/                # JPA Entities (Book, User, Order, Review, Listing)
│   │   ├── repository/            # Spring Data Repositories
│   │   ├── dto/                   # Request/Response DTOs & Validation Regex
│   │   ├── mapper/                # MapStruct Entity/DTO Mappers
│   │   ├── service/               # AuthService, EmailService, BookService, OrderService
│   │   ├── controller/            # REST Controllers (/api/auth, /api/books, /api/orders)
│   │   └── exception/             # GlobalExceptionHandler & ErrorCode Enum
│   ├── src/main/resources/
│   │   ├── application.yml        # Core configurations & Resend SMTP defaults
│   │   ├── application-prod.yml   # Production profile for Cloud PostgreSQL (Supabase/Neon)
│   │   └── templates/email/       # Luxury HTML Email templates
│   ├── pom.xml                    # Maven dependencies
│   └── .env.example               # Safe environment template
│
├── frontend/                      # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── api/                   # Axios client with auto-refresh token interceptor
│   │   ├── store/                 # Zustand authentication and session state
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── components/            # BookCard, Navbar, Footer, ReviewModal, ProtectedRoute
│   │   └── pages/                 # ExplorePage, MarketplacePage, LibraryPage, DashboardPage
│   ├── tailwind.config.js         # Obsidian & Gold luxury color palette
│   └── package.json
│
├── .gitignore                     # Production ignore rules (.env, data/, target/)
└── README.md                      # System documentation
```

---

## ⚙️ Environment Configuration

> [!CAUTION]
> **CRITICAL SECURITY RULE**: Never commit `.env` files to Git. All secrets must remain local or configured securely in your cloud hosting provider's dashboard.

### Backend `.env` (`backend/.env`):
```env
# Server Port (8088 recommended to prevent conflicts)
PORT=8088

# Cloud Database (e.g. Supabase PostgreSQL)
DATABASE_URL=jdbc:postgresql://db.your-project.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=your_cloud_database_password

# Resend Transactional Email API Key
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_your_resend_api_key_here
MAIL_FROM=Bookify <onboarding@resend.dev>

# Security Secrets
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8088/api
VITE_GOOGLE_CLIENT_ID=236418381713-v49dnelbt02udf5euipsnpb1a58dp7mq.apps.googleusercontent.com
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
* **Java 21 or Java 22** ([Download JDK](https://www.oracle.com/java/technologies/downloads/))
* **Node.js 18+** & npm ([Download Node](https://nodejs.org/))
* **Maven 3.9+**

### 2. Start Backend API
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
* **API Endpoints**: `http://localhost:8088/api`
* **Swagger API Docs**: `http://localhost:8088/swagger-ui.html`

### 3. Start Frontend Web Client
```bash
cd frontend
npm install
npm run dev
```
* **Frontend Application**: `http://localhost:5173`

---

## 🌐 Production Deployment Guide

### A. Deploy Backend (Render / Railway / AWS EC2)
1. Link your GitHub repository to **Render** or **Railway**.
2. Select **Docker** or **Maven/Java** environment.
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -Dspring.profiles.active=prod -jar target/bookify-api-1.0.0-SNAPSHOT.jar`
5. Add Environment Variables in the hosting dashboard:
   * `DATABASE_URL`: Your Supabase connection string.
   * `DB_USERNAME`: `postgres`
   * `DB_PASSWORD`: Your Supabase DB password.
   * `MAIL_PASSWORD`: Your Resend API Key (`re_...`).
   * `JWT_SECRET`: Secure 256-bit key.
   * `FRONTEND_URL`: Your live frontend URL (`https://your-bookify.vercel.app`).

### B. Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
1. Import the `frontend` directory into **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   * `VITE_API_URL`: Your live backend API URL (e.g. `https://bookify-api.onrender.com/api`).
   * `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.

---

## 📜 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with 6-criteria password | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT tokens | Public |
| `POST` | `/api/auth/google` | Google One-Tap / OAuth Login | Public |
| `POST` | `/api/auth/send-otp` | Send 6-Digit Password Reset OTP via Resend | Public |
| `POST` | `/api/auth/reset-password-otp` | Reset Password using OTP & Token | Public |
| `GET` | `/api/books` | Browse books with pagination & filters | Public |
| `GET` | `/api/marketplace/listings` | Explore pre-loved book listings | Public |
| `POST` | `/api/orders` | Create escrow-secured order | Authenticated |
| `GET` | `/api/library/my-shelf` | View personal reading shelf & progress | Authenticated |
| `POST` | `/api/library/update-progress`| Update reading page count & velocity | Authenticated |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with dedication by <strong>Aditya Sharma</strong> • 2026
</p>
