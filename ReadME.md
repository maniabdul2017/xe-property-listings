# XE Property Ads — Web Developer Challenge

A full-stack property classifieds application built for the XE.gr Web Developer Challenge.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | Node.js + Express |
| Database | SQLite via better-sqlite3 |
| Caching | LRU Cache (autocomplete) |
| Testing | Jest + Supertest (server) |

---

## Getting Started

### Prerequisites

- Node.js v24+
- npm

### 1. Clone the repository
```bash
git clone <repo-url>
cd xe-property-ads
```

### 2. Set up the server
```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```
PORT=3001
AUTOCOMPLETE_API_URL=<provided in challenge PDF>
DB_PATH=./ads.db
```

### 3. Set up the client
```bash
cd client
npm install



### 4. Run the app

Open two terminals:
```bash
# Terminal 1 — server
cd server
npm run dev

# Terminal 2 — client
cd client
npm run dev
```

Visit `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/autocomplete?input=xxx` | Area autocomplete (min 3 chars) |
| GET | `/api/ads` | Get all ads (supports filters) |
| GET | `/api/ads/:id` | Get single ad |
| POST | `/api/ads` | Create new ad |

### Filter parameters for `GET /api/ads`

| Param | Example | Description |
|---|---|---|
| `type` | `?type=rent` | rent / buy / exchange / donation |
| `property_type` | `?property_type=apartment` | house / apartment / studio etc |
| `min_price` | `?min_price=500` | Minimum price in euros |
| `max_price` | `?max_price=1500` | Maximum price in euros |
| `bedrooms` | `?bedrooms=2` | Number of bedrooms (use `4+` for 4 or more) |
| `features` | `?features=garden,balcony` | Comma separated features |

### POST /api/ads — Request body
```json
{
  "title": "Beautiful apartment in Kolonaki",
  "type": "rent",
  "property_type": "apartment",
  "area_text": "Kolonaki, Athens, Ελλάδα",
  "place_id": "ChIJabc123",
  "price": 800,
  "bedrooms": 2,
  "bathrooms": 1,
  "levels": 1,
  "size_sqm": 75,
  "features": ["garden", "balcony"],
  "description": "Nice place with a great view."
}
```

---

## Business Rules

| Field | Rent | Buy | Exchange | Donation |
|---|---|---|---|---|
| Title | required | required | required | required |
| Type | required | required | required | required |
| Property Type | required | required | required | required |
| Area + Place ID | required | required | required | required |
| Price | required | required | hidden | hidden |
| Description | optional | optional | required | optional |

---

## Autocomplete Caching

Area autocomplete results are cached using an LRU cache to reduce calls to the XE API:

- **Max entries:** 500 unique queries
- **TTL:** 5 minutes per entry
- **Eviction:** Least Recently Used when full
- **Debounce:** 300ms on the frontend before triggering search

---

## Running Tests
```bash
cd server

# Run tests
npm test

# Run with coverage report
npm run test:coverage
```





## Features

### Required
- ✅ New property ad form with client and server validation
- ✅ Area autocomplete using XE API with `placeId` submission
- ✅ All ad types: Rent, Buy, Exchange, Donation
- ✅ Error handling with 422 validation responses

### Bonus
- ✅ SQLite database persistence
- ✅ Ads list page with all submitted ads
- ✅ Autocomplete LRU caching
- ✅ Extra property fields: type, bedrooms, bathrooms, levels, size, features
- ✅ Filter ads by type, property type, price range, bedrooms and features
- ✅ Ad detail page with Google Maps link via Place ID
- ✅ Mobile responsive design