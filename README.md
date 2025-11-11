# Lumanagi Intelligence Agent

## 🚀 Quick Start

### Frontend
```bash
npm install
npm start
# Opens on http://localhost:5173/
```

### Backend (Optional - Demo mode works without backend)
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001/
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend Stack  
- **Node.js + Express** - REST API server
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - Request logging

### Demo Login
- Email: `admin@lumanagi.com`
- Password: `demo123`
- Or click "Demo Login" button

### Running Both Servers
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend  
cd backend
npm run dev
```

## 🚢 Deployment

### Frontend (Static)
- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront
- Requirements: Serve from HTTPS for security

### Backend (API)
- Deploy to: Railway, Render, AWS EC2, DigitalOcean
- Requirements: Node.js 18+, persistent storage
- Database: PostgreSQL recommended for production

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure PostgreSQL database
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🔧 API Reference

### Entity Operations
All entities support CRUD operations:
- `GET /api/{entity}` - List with pagination
- `POST /api/{entity}` - Create new record
- `PUT /api/{entity}/:id` - Update existing
- `DELETE /api/{entity}/:id` - Delete record

### Integration Services
- `POST /api/integrations/llm/invoke` - AI/LLM requests
- `POST /api/integrations/email/send` - Email notifications
- `POST /api/integrations/files/upload` - File uploads

## 📄 License

MIT License - Free for commercial and personal use.