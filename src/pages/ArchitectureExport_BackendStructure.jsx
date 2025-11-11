import React from "react";
import { Download, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackendStructureExport() {
  const backendStructure = `# Lumanagi Backend Structure

## 📁 Project Structure

\`\`\`
lumanagi-backend/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Seed data
├── src/
│   ├── config/
│   │   ├── database.ts            # Prisma client
│   │   ├── env.ts                 # Environment variables
│   │   └── constants.ts
│   ├── middleware/
│   │   ├── auth.ts                # JWT authentication
│   │   ├── authorize.ts           # Role-based authorization
│   │   ├── errorHandler.ts        # Global error handler
│   │   ├── rateLimit.ts           # Rate limiting
│   │   └── validator.ts           # Request validation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── contracts.routes.ts
│   │   ├── oracles.routes.ts
│   │   ├── tokens.routes.ts
│   │   ├── markets.routes.ts
│   │   ├── alerts.routes.ts
│   │   ├── compliance.routes.ts
│   │   ├── security.routes.ts
│   │   ├── audit.routes.ts
│   │   ├── agents.routes.ts
│   │   ├── policies.routes.ts
│   │   ├── governance.routes.ts
│   │   ├── risk.routes.ts
│   │   ├── treasury.routes.ts
│   │   ├── simulations.routes.ts
│   │   └── index.ts               # Route aggregator
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── contracts.controller.ts
│   │   ├── oracles.controller.ts
│   │   ├── agents.controller.ts
│   │   └── ... (all entities)
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── contracts.service.ts
│   │   ├── oracles.service.ts
│   │   ├── agents.service.ts
│   │   ├── ai.service.ts
│   │   └── ... (business logic)
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── express.d.ts           # Express type extensions
│   │   └── entities.ts
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

---

## 🔧 Server Setup (server.ts)

\`\`\`typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

export default app;
\`\`\`

---

## 🔐 Authentication Middleware

\`\`\`typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }

    next();
  };
};
\`\`\`

---

## 🎯 Example Controller

\`\`\`typescript
// src/controllers/contracts.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const listContracts = async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0, status } = req.query;

    const where = status ? { status: status as string } : undefined;

    const [contracts, total] = await Promise.all([
      prisma.contractMetric.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { created_date: 'desc' }
      }),
      prisma.contractMetric.count({ where })
    ]);

    res.json({ data: contracts, total });
  } catch (error) {
    console.error('Error listing contracts:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch contracts' }
    });
  }
};

export const getContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contractMetric.findUnique({
      where: { id }
    });

    if (!contract) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Contract not found' }
      });
    }

    res.json({ data: contract });
  } catch (error) {
    console.error('Error getting contract:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch contract' }
    });
  }
};

export const createContract = async (req: AuthRequest, res: Response) => {
  try {
    const contract = await prisma.contractMetric.create({
      data: {
        ...req.body,
        created_by: req.user!.email
      }
    });

    // Log action
    await prisma.adminLog.create({
      data: {
        action: \`Created contract: \${contract.contract_name}\`,
        endpoint: '/api/contracts',
        status: 'SUCCESS',
        user_role: req.user!.role,
        created_by: req.user!.email
      }
    });

    res.status(201).json({ data: contract });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create contract' }
    });
  }
};

export const updateContract = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contractMetric.update({
      where: { id },
      data: req.body
    });

    await prisma.adminLog.create({
      data: {
        action: \`Updated contract: \${contract.contract_name}\`,
        endpoint: \`/api/contracts/\${id}\`,
        status: 'SUCCESS',
        user_role: req.user!.role,
        created_by: req.user!.email
      }
    });

    res.json({ data: contract });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update contract' }
    });
  }
};

export const deleteContract = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contractMetric.delete({
      where: { id }
    });

    await prisma.adminLog.create({
      data: {
        action: \`Deleted contract ID: \${id}\`,
        endpoint: \`/api/contracts/\${id}\`,
        status: 'SUCCESS',
        user_role: req.user!.role,
        created_by: req.user!.email
      }
    });

    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete contract' }
    });
  }
};
\`\`\`

---

## 🛣️ Example Routes

\`\`\`typescript
// src/routes/contracts.routes.ts
import express from 'express';
import * as contractsController from '../controllers/contracts.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, contractsController.listContracts);
router.get('/:id', authenticate, contractsController.getContract);
router.post('/', authenticate, authorize(['ADMIN', 'OPERATOR']), contractsController.createContract);
router.patch('/:id', authenticate, authorize(['ADMIN', 'OPERATOR']), contractsController.updateContract);
router.delete('/:id', authenticate, authorize(['ADMIN']), contractsController.deleteContract);

export default router;
\`\`\`

---

## 🧰 Utility Functions

\`\`\`typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
\`\`\`

\`\`\`typescript
// src/utils/hash.ts
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
\`\`\`

---

## 📦 Package.json

\`\`\`json
{
  "name": "lumanagi-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "tsx prisma/seed.ts",
    "test": "jest",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/cors": "^2.8.13",
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "tsx": "^3.12.7",
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "@types/jest": "^29.5.0",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12"
  }
}
\`\`\`

---

## 🌍 Environment Variables

\`\`\`env
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lumanagi"

# JWT Secrets
JWT_SECRET="your-secret-key-here-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-here-change-in-production"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Optional: External Services
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
\`\`\`

---

## 🧪 Testing Example

\`\`\`typescript
// src/__tests__/contracts.test.ts
import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';

describe('Contracts API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@lumanagi.com',
        password: 'TestPass123!'
      });
    authToken = res.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/contracts', () => {
    it('should return contracts list', async () => {
      const res = await request(app)
        .get('/api/contracts')
        .set('Authorization', \`Bearer \${authToken}\`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/contracts?status=HEALTHY')
        .set('Authorization', \`Bearer \${authToken}\`);

      expect(res.status).toBe(200);
      res.body.data.forEach((contract: any) => {
        expect(contract.status).toBe('HEALTHY');
      });
    });
  });

  describe('POST /api/contracts', () => {
    it('should create a new contract', async () => {
      const res = await request(app)
        .post('/api/contracts')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send({
          contract_name: 'TestContract',
          contract_address: '0x123...',
          status: 'HEALTHY',
          daily_invocations: 100,
          avg_gas_cost: 0.05
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.contract_name).toBe('TestContract');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/contracts')
        .send({
          contract_name: 'TestContract',
          contract_address: '0x123...'
        });

      expect(res.status).toBe(401);
    });
  });
});
\`\`\``;

  const handleDownload = () => {
    const blob = new Blob([backendStructure], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumanagi-backend-structure.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Backend Structure Export</h1>
          <p className="text-white/60">Complete Node.js + Express + Prisma backend architecture</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#39ff14] hover:bg-[#2ecc11] text-black">
          <Download className="w-4 h-4 mr-2" />
          Download Backend Docs
        </Button>
      </div>

      <div className="bg-[#0F111A] rounded-xl border border-white/10 p-6 max-h-[600px] overflow-y-auto">
        <pre className="text-sm text-white/80 whitespace-pre-wrap">
          {backendStructure}
        </pre>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="text-white font-bold">Routes</h3>
          </div>
          <p className="text-4xl font-bold text-[#3B82F6]">15+</p>
          <p className="text-sm text-white/60 mt-2">API route files</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="text-white font-bold">Controllers</h3>
          </div>
          <p className="text-4xl font-bold text-[#8B5CF6]">15+</p>
          <p className="text-sm text-white/60 mt-2">Request handlers</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#39ff14]" />
            <h3 className="text-white font-bold">Services</h3>
          </div>
          <p className="text-4xl font-bold text-[#39ff14]">15+</p>
          <p className="text-sm text-white/60 mt-2">Business logic layers</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-white font-bold">Middleware</h3>
          </div>
          <p className="text-4xl font-bold text-[#00d4ff]">8+</p>
          <p className="text-sm text-white/60 mt-2">Security & validation</p>
        </div>
      </div>
    </div>
  );
}