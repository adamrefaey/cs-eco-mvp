import React from "react";
import { ArrowRight, Code2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MigrationGuide() {
  const migrationDoc = `# Lumanagi Migration Guide: Base44 → Standalone Stack

## 🎯 Overview

This guide maps Base44 patterns to conventional technologies for a complete migration.

---

## 🏗️ Stack Comparison

| Layer | Base44 | Standalone |
|-------|--------|------------|
| Frontend | React (Base44 runtime) | React + Vite + TypeScript |
| State | Base44 SDK | Zustand / Context API |
| Routing | Base44 pages | React Router v6 |
| UI | shadcn/ui | Radix UI + shadcn/ui |
| Icons | Lucide | Lucide React |
| Styling | Tailwind | Tailwind CSS |
| Backend | Base44 API | Node.js + Express |
| Database | Base44 entities | PostgreSQL + Prisma ORM |
| Auth | Base44 auth | JWT + refresh tokens |
| API | Base44 SDK | RESTful fetch/axios |

---

## 📦 Project Setup

### 1. Initialize Frontend (Vite + React + TypeScript)

\`\`\`bash
npm create vite@latest lumanagi-frontend -- --template react-ts
cd lumanagi-frontend
npm install

# Install dependencies
npm install \
  zustand \
  react-router-dom \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  lucide-react \
  tailwindcss \
  clsx \
  tailwind-merge \
  framer-motion \
  react-hook-form \
  date-fns \
  recharts

# Setup Tailwind
npx tailwindcss init -p
\`\`\`

### 2. Initialize Backend (Node.js + Express + Prisma)

\`\`\`bash
mkdir lumanagi-backend && cd lumanagi-backend
npm init -y

npm install \
  express \
  @prisma/client \
  bcrypt \
  jsonwebtoken \
  dotenv \
  cors \
  helmet \
  express-rate-limit

npm install -D \
  prisma \
  typescript \
  @types/node \
  @types/express \
  @types/bcrypt \
  @types/jsonwebtoken \
  tsx \
  nodemon

# Initialize Prisma
npx prisma init
\`\`\`

---

## 🔄 Pattern Migration

### Authentication

**Base44:**
\`\`\`javascript
import { User } from "@/api/entities";

const user = await User.me();
await User.login();
await User.logout();
await User.updateMyUserData({ settings });
\`\`\`

**Standalone:**
\`\`\`typescript
// Frontend (Zustand store)
import create from 'zustand';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { user, access_token, refresh_token } = await res.json();
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    set({ user, accessToken: access_token });
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null });
  },
  
  refreshToken: async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token })
    });
    const { access_token } = await res.json();
    localStorage.setItem('access_token', access_token);
    set({ accessToken: access_token });
  }
}));

// Backend (Express + JWT)
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const access_token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refresh_token = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ user, access_token, refresh_token });
});

// Middleware
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

---

### Entity CRUD Operations

**Base44:**
\`\`\`javascript
import { ContractMetric } from "@/api/entities";

// List
const contracts = await ContractMetric.list("-created_date", 20);

// Filter
const healthy = await ContractMetric.filter({ status: "healthy" }, "-created_date");

// Create
const contract = await ContractMetric.create({
  contract_name: "TokenStaking",
  contract_address: "0x123...",
  status: "healthy"
});

// Update
await ContractMetric.update(id, { status: "paused" });

// Delete
await ContractMetric.delete(id);

// Get schema
const schema = await ContractMetric.schema();
\`\`\`

**Standalone:**
\`\`\`typescript
// Frontend (custom hook)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

const fetcher = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(\`\${API_URL}\${url}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${token}\`,
      ...options?.headers
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const useContracts = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: () => fetcher('/api/contracts')
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetcher('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    }
  });
};

// Backend (Express + Prisma)
app.get('/api/contracts', authenticate, async (req, res) => {
  const { limit = 20, offset = 0, status } = req.query;
  
  const contracts = await prisma.contractMetric.findMany({
    where: status ? { status } : undefined,
    take: Number(limit),
    skip: Number(offset),
    orderBy: { created_date: 'desc' }
  });
  
  const total = await prisma.contractMetric.count({
    where: status ? { status } : undefined
  });
  
  res.json({ data: contracts, total });
});

app.post('/api/contracts', authenticate, authorize(['ADMIN', 'OPERATOR']), async (req, res) => {
  const contract = await prisma.contractMetric.create({
    data: {
      ...req.body,
      created_by: req.user.email
    }
  });
  res.status(201).json({ data: contract });
});

app.patch('/api/contracts/:id', authenticate, authorize(['ADMIN', 'OPERATOR']), async (req, res) => {
  const contract = await prisma.contractMetric.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json({ data: contract });
});
\`\`\`

---

### Routing

**Base44:**
\`\`\`javascript
// Automatic routing via pages folder
// pages/Dashboard.js → /dashboard

import { createPageUrl } from "@/utils";
const url = createPageUrl("Dashboard");
\`\`\`

**Standalone:**
\`\`\`typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import { useAuthStore } from './stores/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="oracles" element={<Oracles />} />
          {/* ... more routes */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Navigation helper
export const routes = {
  dashboard: '/dashboard',
  contracts: '/contracts',
  oracles: '/oracles'
};
\`\`\`

---

### State Management

**Base44:**
\`\`\`javascript
// Built-in state management via SDK
import { useEffect, useState } from "react";
import { ContractMetric } from "@/api/entities";

const [contracts, setContracts] = useState([]);

useEffect(() => {
  loadContracts();
}, []);

const loadContracts = async () => {
  const data = await ContractMetric.list();
  setContracts(data);
};
\`\`\`

**Standalone:**
\`\`\`typescript
// Global state with Zustand
import create from 'zustand';

interface ContractStore {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  fetchContracts: () => Promise<void>;
  updateContract: (id: string, data: Partial<Contract>) => Promise<void>;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  loading: false,
  error: null,
  
  fetchContracts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/contracts', {
        headers: {
          Authorization: \`Bearer \${localStorage.getItem('access_token')}\`
        }
      });
      const { data } = await res.json();
      set({ contracts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  updateContract: async (id, data) => {
    const res = await fetch(\`/api/contracts/\${id}\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${localStorage.getItem('access_token')}\`
      },
      body: JSON.stringify(data)
    });
    const updated = await res.json();
    set({
      contracts: get().contracts.map(c => c.id === id ? updated.data : c)
    });
  }
}));

// Usage in component
import { useContractStore } from '@/stores/contractStore';

function Contracts() {
  const { contracts, loading, fetchContracts } = useContractStore();
  
  useEffect(() => {
    fetchContracts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{contracts.map(...)}</div>;
}
\`\`\`

---

## 🔐 Security Implementation

### JWT Middleware

\`\`\`typescript
// src/middleware/auth.ts
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
\`\`\`

### Password Hashing

\`\`\`typescript
import bcrypt from 'bcrypt';

// Register
const password_hash = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: { email, password_hash, full_name }
});

// Login
const user = await prisma.user.findUnique({ where: { email } });
const valid = await bcrypt.compare(password, user.password_hash);
\`\`\`

---

## 📱 Flutter Mobile Integration

All API endpoints follow standard REST conventions and can be consumed directly:

\`\`\`dart
// lib/services/api_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  final String baseUrl = 'http://localhost:3001/api';
  String? accessToken;
  
  Future<Map<String, dynamic>> get(String path) async {
    final res = await http.get(
      Uri.parse('\$baseUrl\$path'),
      headers: {
        'Authorization': 'Bearer \$accessToken',
        'Content-Type': 'application/json'
      }
    );
    return json.decode(res.body);
  }
  
  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> data) async {
    final res = await http.post(
      Uri.parse('\$baseUrl\$path'),
      headers: {
        'Authorization': 'Bearer \$accessToken',
        'Content-Type': 'application/json'
      },
      body: json.encode(data)
    );
    return json.decode(res.body);
  }
}
\`\`\`

---

## 🧪 Testing Setup

### Frontend Tests (Vitest)

\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/user-event
\`\`\`

\`\`\`typescript
// src/components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText('Mission Control')).toBeInTheDocument();
});
\`\`\`

### Backend Tests (Jest)

\`\`\`bash
npm install -D jest @types/jest supertest
\`\`\`

\`\`\`typescript
// src/__tests__/contracts.test.ts
import request from 'supertest';
import app from '../app';

describe('GET /api/contracts', () => {
  it('returns contracts list', async () => {
    const res = await request(app)
      .get('/api/contracts')
      .set('Authorization', \`Bearer \${testToken}\`);
    
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
\`\`\`

---

## 📦 Deployment

### Frontend (Vercel / Netlify)

\`\`\`bash
# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
\`\`\`

### Backend (Railway / Render / Fly.io)

\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
\`\`\`

\`\`\`bash
# Deploy to Railway
railway up

# Environment variables:
# DATABASE_URL=postgresql://...
# JWT_SECRET=...
# JWT_REFRESH_SECRET=...
# NODE_ENV=production
\`\`\`

---

## ✅ Migration Checklist

- [ ] Setup Vite + React + TypeScript project
- [ ] Initialize Express + Prisma backend
- [ ] Copy Prisma schema from export
- [ ] Run migrations: \`npx prisma migrate dev\`
- [ ] Implement JWT authentication
- [ ] Create API routes for all entities
- [ ] Setup Zustand stores
- [ ] Configure React Router
- [ ] Migrate all pages/components
- [ ] Setup environment variables
- [ ] Add error handling & logging
- [ ] Write tests
- [ ] Setup CI/CD pipeline
- [ ] Deploy frontend & backend

---

## 🚀 Next Steps

1. Download all architecture exports from this platform
2. Follow this migration guide step-by-step
3. Start with authentication + 1-2 entities
4. Gradually migrate all features
5. Test thoroughly before go-live

---

**Full Independence Achieved** 🎉`;

  const handleDownload = () => {
    const blob = new Blob([migrationDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumanagi-migration-guide.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Migration Guide</h1>
          <p className="text-white/60">Complete guide for migrating from Base44 to standalone stack</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#39ff14] hover:bg-[#2ecc11] text-black">
          <Download className="w-4 h-4 mr-2" />
          Download Guide
        </Button>
      </div>

      <div className="bg-[#0F111A] rounded-xl border border-white/10 p-6 max-h-[600px] overflow-y-auto">
        <pre className="text-sm text-white/80 whitespace-pre-wrap">
          {migrationDoc}
        </pre>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#3B82F6]" />
            Tech Stack Mapping
          </h3>
          <div className="space-y-3">
            {[
              { from: "Base44 Runtime", to: "Vite + React + TS" },
              { from: "Base44 SDK", to: "Zustand + React Query" },
              { from: "Base44 Entities", to: "Prisma ORM" },
              { from: "Base44 Auth", to: "JWT + Refresh Tokens" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <span className="text-white/60">{item.from}</span>
                <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-white font-medium">{item.to}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-4">Migration Phases</h3>
          <div className="space-y-3">
            {[
              { phase: "Phase 1", task: "Setup infrastructure", status: "Ready" },
              { phase: "Phase 2", task: "Migrate authentication", status: "Ready" },
              { phase: "Phase 3", task: "Migrate entities & API", status: "Ready" },
              { phase: "Phase 4", task: "Migrate UI components", status: "Ready" },
              { phase: "Phase 5", task: "Testing & deployment", status: "Ready" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{item.phase}: {item.task}</span>
                <span className="text-[#39ff14] text-xs font-bold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}