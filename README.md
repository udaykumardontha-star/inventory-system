# Inventory & Order Management System

A full-stack web application for managing products, customers, and orders with inventory tracking.

## Tech Stack

- **Frontend:** React
- **Backend:** Flask (Python)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Features

- Product management (CRUD operations)
- Customer management
- Order creation with automatic stock deduction
- Dashboard with summary statistics
- Low stock alerts

## Getting Started

### Prerequisites

- Docker Desktop installed
- Git

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <your-repo-url>
cd assignment
```

2. Create a `.env` file (or use the provided one):
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=inventory_db
REACT_APP_API_URL=http://localhost:5000/api
```

3. Build and run:
```bash
docker-compose up --build
```

4. Open the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Stopping

```bash
docker-compose down
```

To also remove the database volume:
```bash
docker-compose down -v
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/customers | Get all customers |
| GET | /api/customers/:id | Get customer by ID |
| POST | /api/customers | Create customer |
| DELETE | /api/customers/:id | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get order details |
| POST | /api/orders | Create order |
| DELETE | /api/orders/:id | Delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Get summary stats |

## Project Structure

```
assignment/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── api.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## Deployment

- **Backend:** Deployed on Render
- **Frontend:** Deployed on Vercel

### Live URLs
- Frontend: https://inventory-system-sigma-six.vercel.app
- Backend API: https://inventory-system-ck85.onrender.com
- Docker Hub: https://hub.docker.com/r/udaykumardonths/inventory-backend
