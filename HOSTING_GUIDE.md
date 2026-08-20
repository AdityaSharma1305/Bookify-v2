# 🚀 Bookify — Live Production Hosting Guide

This guide walks you through deploying **Bookify** live to the cloud so anyone around the world can register, search books, write reviews, and buy/sell on the marketplace.

---

## ⚡ Option 1: 1-Click Free Cloud Hosting (Recommended)

### Step 1: Push Project to GitHub
```bash
git init
git add .
git commit -m "Production ready Bookify platform by Babli"
git remote add origin https://github.com/YOUR_USERNAME/bookify.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Render.com (or Railway.app)
1. Go to [Render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository and select the **`backend`** directory (or use Docker runtime).
3. Set Build Command: `mvn clean package -DskipTests`
4. Set Start Command: `java -jar target/bookify-api-1.0.0-SNAPSHOT.jar`
5. Add Environment Variables:
   - `PORT`: `8088`
   - `DATABASE_URL`: `jdbc:postgresql://db.[YOUR_SUPABASE_PROJECT_REF].supabase.co:5432/postgres` (Copy from your Supabase Dashboard -> Project Settings -> Database -> URI / Connection String)
   - `DB_USERNAME`: `postgres`
   - `DB_PASSWORD`: `[YOUR_SUPABASE_DB_PASSWORD]`
   - `JWT_SECRET`: `your_256_bit_secure_jwt_secret_key_here`
   - `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app`

### Step 3: Deploy Frontend on Vercel or Netlify
1. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
2. Select Root Directory: **`frontend`**.
3. Framework Preset: **`Vite`**.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-render-backend-url.onrender.com/api`
5. Click **Deploy**!

---

## 🐳 Option 2: 1-Command Docker Hosting (Self-Hosted VPS / DigitalOcean / Linode)

On any server with Docker installed, simply run:
```bash
docker-compose up --build -d
```
Your full website will be running live on port `80` with continuous data persistence!

---

## 👨‍💻 Creator
**Created & Designed with ❤️ by Aditya Sharma**
