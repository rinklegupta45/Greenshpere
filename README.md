# GreenSphere – Green Social Media (MERN)

A full-stack MERN app: Instagram + LinkedIn style feed for environment-related posts and eco activities. Users earn eco-points, join challenges, and redeem rewards.

## Features

- **Auth:** Signup / Login with JWT
- **Posts:** Create posts (text + image + location), like, comment
- **Social:** Follow/unfollow users, feed from followed users + trending
- **Eco-points:** Earn points for eco categories (tree plantation, recycling, cleanup, cycling, etc.)
- **Profile:** Bio, followers, following, posts, points, badges
- **Leaderboard:** Top users by eco-points
- **Challenges:** Admin-created weekly challenges; users join (optional proof + admin approval)
- **Rewards:** Redeem points for badges, coupons, certificates
- **Admin:** Create challenges/rewards, approve proof submissions, view analytics

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer (images: Cloudinary or local disk)

## Project Structure

```
GreenSphere/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Setup (run locally)

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (e.g. `mongod`) or a MongoDB Atlas connection string

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET. Optionally set CLOUDINARY_* for image uploads.
npm run dev
```

Server runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd frontend
npm install
# Optional: cp .env.example .env and set VITE_API_URL if not using proxy (default proxy is to localhost:5000)
npm run dev
```

App runs at **http://localhost:3000** and proxies `/api` and `/uploads` to the backend.

### 4. Seed data (optional)

```bash
cd backend
npm run seed
```

- **Admin:** `admin@greensphere.com` / `admin123`
- **Users:** `emma@example.com`, `sam@example.com`, `rita@example.com` / `password123`

## Environment variables

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | (Optional) Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | (Optional) Cloudinary API key |
| `CLOUDINARY_API_SECRET` | (Optional) Cloudinary API secret |
| `FRONTEND_URL` | (Optional) Frontend origin for CORS |

If Cloudinary is not set, images are stored in `backend/uploads/` and served at `/uploads`.

### Frontend (optional `.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) when not using Vite proxy |

## API overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (protected)
- **Posts:** `POST /api/posts`, `GET /api/posts/feed`, `GET /api/posts/user/:userId`, `GET /api/posts/:id`, `PUT /api/posts/:id/like`, `POST /api/posts/:id/comment`, `DELETE /api/posts/:id` (protected)
- **Users:** `GET /api/users/leaderboard`, `GET /api/users/profile/:id`, `PUT /api/users/profile/:id`, `PUT /api/users/follow/:id` (profile/follow protected)
- **Challenges:** `GET /api/challenges`, `POST /api/challenges/:id/join`, `PUT /api/challenges/:id/proof`, `GET /api/challenges/my` (join/proof/my protected)
- **Rewards:** `GET /api/rewards`, `POST /api/rewards/:id/redeem` (redeem protected)
- **Admin:** `GET /api/admin/analytics`, `GET /api/admin/challenges`, `GET /api/admin/challenges/pending`, `POST /api/admin/challenges`, `PUT /api/admin/challenges/:id`, `PUT /api/admin/challenges/:id/participation/:participationId`, `GET /api/admin/rewards`, `POST /api/admin/rewards`, `PUT /api/admin/rewards/:id` (admin only)

## Pages

- `/login`, `/register`
- `/dashboard` – main feed + trending
- `/profile/:id`
- `/create-post`
- `/leaderboard`
- `/challenges`
- `/rewards`
- `/admin/dashboard`, `/admin/create-challenge`, `/admin/create-reward`

Enjoy building a greener community.
