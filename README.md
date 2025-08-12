[README.md](https://github.com/user-attachments/files/21731121/README.md)
# Premium Cars API (Express + MongoDB) — with 360° Spin

## Quick Start
1) Copy `.env.example` to `.env` and set `MONGODB_URI` if needed  
2) Install & run
```bash
cd backend
npm install
npm run seed
npm run dev
```
API runs at `http://localhost:4000`

## Endpoints
- `GET /api/health`
- `GET /api/brands`
- `GET /api/cars?brand=bmw&q=Panamera&minPrice=3000000&maxPrice=7000000&sort=price-desc`
- `GET /api/cars/:id`
- `POST /api/contact` `{ name, email, phone?, message }`
