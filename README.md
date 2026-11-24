# Corn — Golden Grain

**Interactive Nutritional Showcase & Express/MongoDB Content Platform**

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=black)
![Express](https://img.shields.io/badge/Express-5.3-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Netlify](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)

A scroll-driven single-product editorial showcase celebrating golden corn, its origins, nutritional profile, varieties, and culinary recipes—backed by a Node.js, Express, and Mongoose API with Netlify Serverless Function support.

- **Live Website:** [https://heartfelt-pika-32c756.netlify.app/](https://heartfelt-pika-32c756.netlify.app/)

---

## Screenshots

![Corn Golden Grain Showcase](docs/screenshots/home.png)

---

## Core Features

- **Scroll-Driven Editorial Experience**: Combines `gsap` scroll triggers (`useScrollAnimation`) and `lenis` smooth scrolling across `Hero`, `CinematicScene`, `VideoScene`, `MediaReveal`, and `FullBleedImage` sections.
- **Interactive Nutrition & Variety Explorer**: Presents structured data cards for `CornOrigin`, `NutritionCard`, `HealthBenefits`, `Varieties`, `RecipeCard`, and `DidYouKnow` facts.
- **Full-Stack API & Seeder**: Express + Mongoose backend (`nutritionRoutes`, `varietyRoutes`, `recipeRoutes`) with seed data (`server/seed/seedData.js`) and `serverless-http` wrapper for Netlify Functions (`netlify/functions/api.js`).
- **Lightweight Client State**: Uses `zustand` and React Context (`AppContext`) paired with `axios` for fetching backend content.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router DOM 7, Tailwind CSS 3, Zustand 5, Axios |
| **Animation** | GSAP 3.15, Lenis 1.3 (`@studio-freight/lenis`) |
| **Backend API** | Node.js, Express 5, Mongoose 9, Helmet, Morgan, CORS |
| **Serverless & Hosting** | Netlify Functions (`serverless-http`), Netlify Hosting (`netlify.toml`) |

---

## Project Structure

```text
Corn-golden-grain-A-single-product-frontend-page/
├── client/                              # React + Vite frontend
│   ├── src/
│   │   ├── components/                  # Hero, CinematicScene, NutritionCard, Varieties, etc.
│   │   ├── context/AppContext.jsx
│   │   ├── hooks/useScrollAnimation.js
│   │   ├── pages/Home.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                              # Express + Mongoose backend
│   ├── config/db.js
│   ├── controllers/                     # nutrition, recipe & variety controllers
│   ├── models/                          # CornVariety, Nutrition, Recipe schemas
│   ├── routes/                          # REST API route modules
│   ├── seed/seedData.js
│   └── server.js
├── netlify/functions/api.js             # Serverless API adapter
├── netlify.toml
└── docs/screenshots/home.png
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (for the optional backend API)

### 1. Run Frontend Client

```bash
git clone https://github.com/IFTI-KAR/Corn-golden-grain-A-single-product-frontend-page.git
cd Corn-golden-grain-A-single-product-frontend-page/client
npm install
npm run dev
```

### 2. Run Backend API (Optional)

```bash
cd ../server
npm install
# Add MONGO_URI in .env, then start Express
node server.js
```
