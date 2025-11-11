import React, { useState } from "react";
import { Download, CheckCircle2, Package, FileCode, Server, Database, Settings, Rocket, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GlassCard from "../components/GlassCard";

export default function ProductionMigrationGuide() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const migrationSteps = [
    {
      title: "1. Initialize Frontend Project",
      commands: [
        "npm create vite@latest lumanagi-frontend -- --template react",
        "cd lumanagi-frontend",
        "npm install"
      ]
    },
    {
      title: "2. Install Dependencies",
      commands: [
        "npm install react-router-dom @tanstack/react-query zustand axios",
        "npm install lucide-react framer-motion date-fns recharts",
        "npm install react-quill lodash react-markdown",
        "npm install -D tailwindcss postcss autoprefixer",
        "npx tailwindcss init -p"
      ]
    },
    {
      title: "3. Initialize Backend",
      commands: [
        "mkdir lumanagi-backend && cd lumanagi-backend",
        "npm init -y",
        "npm install express @prisma/client jsonwebtoken bcryptjs cors",
        "npm install -D typescript prisma tsx @types/node @types/express",
        "npx prisma init"
      ]
    },
    {
      title: "4. Set Up Database",
      commands: [
        "docker-compose up -d",
        "cd backend && npx prisma migrate dev --name init",
        "npx prisma generate"
      ]
    },
    {
      title: "5. Configure Environment",
      commands: [
        "cp .env.example .env",
        "# Edit .env with your actual values",
        "# Update DATABASE_URL, JWT_SECRET, etc."
      ]
    },
    {
      title: "6. Start Development",
      commands: [
        "# Terminal 1 - Backend",
        "cd backend && npm run dev",
        "",
        "# Terminal 2 - Frontend",
        "cd lumanagi-frontend && npm run dev"
      ]
    }
  ];

  const fileStructure = `lumanagi/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All 42 pages from exports
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # Zustand state management
│   │   ├── api/           # API client & services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Main application
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── controllers/   # Business logic
│   │   ├── services/      # Data access layer
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Express app
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
└── README.md`;

  const envExample = `# Backend .env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://lumanagi:lumanagi_pass@localhost:5432/lumanagi"
JWT_SECRET=change-this-super-secret-key
JWT_REFRESH_SECRET=change-this-refresh-secret
FRONTEND_URL=http://localhost:3000

# Frontend .env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000`;

  const quickStartGuide = `🚀 Quick Start Guide

1. Clone & Setup:
   git clone <your-repo>
   cd lumanagi

2. Start Database:
   docker-compose up -d

3. Backend Setup:
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev

4. Frontend Setup:
   cd frontend
   npm install
   npm run dev

5. Access Application:
   Frontend: http://localhost:3000
   Backend API: http://localhost:5000
   Database: postgresql://localhost:5432

Default Admin:
   Email: admin@lumanagi.ai
   Password: admin123 (change immediately!)`;

  const productionChecklist = [
    { item: "Update all environment variables in .env", done: false },
    { item: "Change JWT secrets to strong random values", done: false },
    { item: "Set up production database (not local Docker)", done: false },
    { item: "Configure CORS for production domain", done: false },
    { item: "Enable SSL/TLS certificates", done: false },
    { item: "Set up monitoring (Sentry, DataDog, etc.)", done: false },
    { item: "Configure backup strategy for database", done: false },
    { item: "Set up CI/CD pipeline", done: false },
    { item: "Enable rate limiting on API", done: false },
    { item: "Run security audit (npm audit)", done: false },
    { item: "Set up logging infrastructure", done: false },
    { item: "Create admin user and disable default credentials", done: false }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Production Migration Guide</h1>
          <p className="text-white/60">Complete guide to deploy Lumanagi as standalone application</p>
        </div>
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
          <Rocket className="w-4 h-4 mr-2" />
          Ready for Migration
        </Badge>
      </div>

      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="steps">Migration Steps</TabsTrigger>
          <TabsTrigger value="structure">File Structure</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="checklist">Production Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-6 mt-6">
          <GlassCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Step-by-Step Migration
              </h2>
              <div className="space-y-6">
                {migrationSteps.map((step, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500/30 pl-6 py-2">
                    <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                    <div className="bg-[#0F111A]/80 rounded-lg p-4 font-mono text-sm">
                      {step.commands.map((cmd, cmdIdx) => (
                        <div key={cmdIdx} className="text-green-400 py-1">
                          {cmd.startsWith('#') ? (
                            <span className="text-gray-500">{cmd}</span>
                          ) : cmd === '' ? (
                            <br />
                          ) : (
                            <>$ {cmd}</>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5" />
                  Quick Start Command
                </h3>
                <Button
                  onClick={() => copyToClipboard(quickStartGuide, 'quickstart')}
                  variant="outline"
                  size="sm"
                  className="border-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'quickstart' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-[#0F111A]/80 rounded-lg p-4 text-sm text-white/80 whitespace-pre-wrap">
                {quickStartGuide}
              </pre>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6 mt-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  Recommended File Structure
                </h2>
                <Button
                  onClick={() => copyToClipboard(fileStructure, 'structure')}
                  variant="outline"
                  size="sm"
                  className="border-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'structure' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-[#0F111A]/80 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre overflow-x-auto">
                {fileStructure}
              </pre>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Directories</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">frontend/src/pages/</div>
                    <div className="text-white/60 text-sm">Copy all 42 pages from ArchitectureExport_ComponentStructure</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">backend/prisma/schema.prisma</div>
                    <div className="text-white/60 text-sm">Copy from ArchitectureExport_DatabaseSchema</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">backend/src/routes/</div>
                    <div className="text-white/60 text-sm">Copy from ArchitectureExport_APIEndpoints</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="config" className="space-y-6 mt-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Environment Configuration
                </h2>
                <Button
                  onClick={() => copyToClipboard(envExample, 'env')}
                  variant="outline"
                  size="sm"
                  className="border-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'env' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-[#0F111A]/80 rounded-lg p-4 text-sm text-yellow-400 font-mono whitespace-pre-wrap">
                {envExample}
              </pre>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Important Configuration Notes
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="font-semibold text-yellow-300 mb-1">Database URL</div>
                  <div className="text-white/70 text-sm">Update with your PostgreSQL credentials. For production, use managed databases (AWS RDS, DigitalOcean, etc.)</div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="font-semibold text-red-300 mb-1">JWT Secrets</div>
                  <div className="text-white/70 text-sm">Generate strong random secrets: <code className="bg-black/30 px-2 py-1 rounded">openssl rand -base64 32</code></div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">CORS Origin</div>
                  <div className="text-white/70 text-sm">Set to your production frontend domain for security</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6 mt-6">
          <GlassCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Production Deployment Checklist
              </h2>
              <div className="space-y-2">
                {productionChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="w-5 h-5 rounded border-2 border-white/30" />
                    <span className="text-white/80">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recommended Hosting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="font-semibold text-white mb-2">Frontend</div>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• Vercel (Recommended)</li>
                    <li>• Netlify</li>
                    <li>• Cloudflare Pages</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="font-semibold text-white mb-2">Backend + Database</div>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• Railway (Recommended)</li>
                    <li>• Render</li>
                    <li>• DigitalOcean App Platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Next Steps After Migration
          </h3>
          <ol className="space-y-3 text-white/80">
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">1.</span>
              <span>Copy all architecture exports to your new project structure</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">2.</span>
              <span>✓ Base44 dependencies have been removed and replaced with JWT authentication</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">3.</span>
              <span>Implement authentication endpoints (refer to Migration Guide)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">4.</span>
              <span>Test all 42 pages and fix any import/dependency issues</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">5.</span>
              <span>Configure production environment variables</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">6.</span>
              <span>Deploy to staging environment first, then production</span>
            </li>
          </ol>
        </div>
      </GlassCard>
    </div>
  );
}