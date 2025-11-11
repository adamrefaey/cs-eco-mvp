# Lumanagi Backend Structure

## Quick Start

This project now runs independently without Base44 dependencies. Here's how to set up the complete stack:

### Frontend (Current Setup)
- ✅ JWT-based authentication implemented
- ✅ Base44 dependencies removed
- ✅ React + Vite + TypeScript ready
- ✅ All 42 pages functional with new auth system

**Start frontend:**
```bash
npm install
npm start
# Opens on http://localhost:5173/
```

### Backend Setup (Required for Full Functionality)

Create a simple Express.js backend to handle authentication and API endpoints:

#### 1. Initialize Backend
```bash
mkdir backend
cd backend
npm init -y
npm install express cors bcryptjs jsonwebtoken dotenv helmet morgan
npm install -D nodemon concurrently
```

#### 2. Basic Server Structure
```
backend/
├── server.js
├── middleware/
│   ├── auth.js
│   └── cors.js
├── routes/
│   ├── auth.js
│   └── api.js
├── models/
│   └── user.js
└── .env
```

#### 3. Environment Variables (.env)
```
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-refresh-token-secret-here
DATABASE_URL=sqlite://./database.db
NODE_ENV=development
```

#### 4. Demo Authentication Endpoints

The frontend is configured to work with these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

#### 5. Entity Endpoints (Mapped from Base44)

All entity operations are mapped to RESTful endpoints:

- `GET /api/contract-metrics` - Get contract metrics
- `POST /api/contract-metrics` - Create contract metric
- `GET /api/token-analytics` - Get token analytics
- `GET /api/alerts` - Get alerts
- `POST /api/alerts` - Create alert
- And 20+ more endpoints for all entities...

#### 6. Integration Services

- `POST /api/integrations/llm/invoke` - LLM invocation
- `POST /api/integrations/email/send` - Email sending
- `POST /api/integrations/files/upload` - File upload

### Recommended Tech Stack

**Backend:**
- Node.js + Express.js
- JWT authentication
- SQLite/PostgreSQL database
- Prisma ORM (optional)

**Production:**
- Docker containers
- PM2 process manager
- NGINX reverse proxy
- SSL certificates

### Current State

✅ **Frontend Ready:**
- All Base44 dependencies removed
- JWT authentication implemented
- 42 pages working independently  
- Modern React + Vite setup
- Component library included (Radix UI)

⚠️ **Backend Needed:**
- Authentication endpoints
- Data persistence layer
- API endpoints for entities
- Integration services

### Demo Mode

The app includes demo login functionality:
- Click "Demo Login" on login page
- Uses mock authentication
- All pages accessible
- No backend required for basic testing

### Next Steps

1. ✅ Frontend is ready to run independently
2. Build Express.js backend using the API structure above
3. Implement database layer (SQLite for dev, PostgreSQL for prod)
4. Add integration services (LLM, email, file handling)
5. Deploy both frontend and backend

The frontend will automatically work once backend endpoints are available at `http://localhost:3001/api`.