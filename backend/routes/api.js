const express = require('express');
const { validateQuery, validateBody, validateParams } = require('../middleware/validate');
const { paginationSchema, sortSchema, idSchema, getEntitySchema } = require('../validators/entity.validator');
const { z } = require('zod');
const { authenticatedApiRateLimiter, writeOperationsRateLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/authenticate');
const { requireResourceAccess } = require('../middleware/authorize');
const router = express.Router();

// Mock data generators for demo purposes
const generateMockData = (type, count = 10) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    switch (type) {
      case 'contract-metrics':
        data.push({
          id: i,
          contract_address: `0x${Math.random().toString(16).substr(2, 40)}`,
          gas_used: Math.floor(Math.random() * 100000),
          transaction_count: Math.floor(Math.random() * 1000),
          status: ['active', 'paused', 'completed'][Math.floor(Math.random() * 3)],
          created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
        });
        break;
      case 'token-analytics':
        data.push({
          id: i,
          token_symbol: 'LMNG',
          price: (Math.random() * 100).toFixed(2),
          volume_24h: Math.floor(Math.random() * 1000000),
          market_cap: Math.floor(Math.random() * 10000000),
          change_24h: ((Math.random() - 0.5) * 20).toFixed(2),
          timestamp: new Date().toISOString()
        });
        break;
      case 'alerts':
        data.push({
          id: i,
          title: `System Alert ${i}`,
          message: `This is a mock alert message for testing purposes`,
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          category: ['security', 'performance', 'compliance', 'system'][Math.floor(Math.random() * 4)],
          status: ['active', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)],
          created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
        });
        break;
      default:
        data.push({
          id: i,
          name: `Mock ${type} ${i}`,
          status: 'active',
          created_at: new Date().toISOString()
        });
    }
  }
  return data;
};

// Generic CRUD routes for all entities
const createEntityRoutes = (entityName) => {
  // Create query validation schema for this entity
  const listQuerySchema = paginationSchema.extend({
    sort: sortSchema,
  });

  // Create param validation schema
  const paramSchema = z.object({
    id: idSchema,
  });

  // GET /api/{entity-name} - List entities with pagination
  router.get(`/${entityName}`, authenticatedApiRateLimiter, authenticateToken, requireResourceAccess(entityName), validateQuery(listQuerySchema), (req, res) => {
    try {
      const { page, limit } = req.query; // Already validated and transformed to numbers
      const data = generateMockData(entityName, limit);

      res.json({
        data,
        pagination: {
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit)
        }
      });
    } catch (error) {
      console.error(`Get ${entityName} error:`, error);
      res.status(500).json({ error: `Failed to fetch ${entityName}` });
    }
  });

  // POST /api/{entity-name} - Create new entity
  router.post(`/${entityName}`, writeOperationsRateLimiter, authenticateToken, requireResourceAccess(entityName), validateBody(getEntitySchema(entityName)), (req, res) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        ...req.body, // Already validated against entity schema
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      res.status(201).json(newItem);
    } catch (error) {
      console.error(`Create ${entityName} error:`, error);
      res.status(500).json({ error: `Failed to create ${entityName}` });
    }
  });

  // PUT /api/{entity-name}/:id - Update entity
  router.put(`/${entityName}/:id`, writeOperationsRateLimiter, authenticateToken, requireResourceAccess(entityName), validateParams(paramSchema), validateBody(getEntitySchema(entityName).partial()), (req, res) => {
    try {
      const { id } = req.params; // Already validated
      const updatedItem = {
        id,
        ...req.body, // Already validated (partial schema allows optional fields)
        updated_at: new Date().toISOString()
      };

      res.json(updatedItem);
    } catch (error) {
      console.error(`Update ${entityName} error:`, error);
      res.status(500).json({ error: `Failed to update ${entityName}` });
    }
  });

  // DELETE /api/{entity-name}/:id - Delete entity
  router.delete(`/${entityName}/:id`, writeOperationsRateLimiter, authenticateToken, requireResourceAccess(entityName), validateParams(paramSchema), (req, res) => {
    try {
      const { id } = req.params; // Already validated
      res.json({ message: `${entityName} ${id} deleted successfully` });
    } catch (error) {
      console.error(`Delete ${entityName} error:`, error);
      res.status(500).json({ error: `Failed to delete ${entityName}` });
    }
  });
};

// Create routes for all entities
const entities = [
  'contract-metrics',
  'token-analytics', 
  'markets',
  'oracle-feeds',
  'admin-logs',
  'alerts',
  'compliance-metrics',
  'security-incidents',
  'risk-assessments',
  'ai-model-metrics',
  'data-quality-metrics',
  'trust-boundary-events',
  'temporal-anomalies',
  'treasury-transactions',
  'simulation-scenarios',
  'ai-feedback',
  'compliance-evidence',
  'agents',
  'policy-states',
  'agent-decision-logs',
  'constitutional-rules',
  'agent-clusters',
  'meta-audits',
  'governance-proposals',
  'system-trust-scores'
];

entities.forEach(entity => createEntityRoutes(entity));

// Integration endpoints
router.post('/integrations/llm/invoke', authenticateToken, async (req, res) => {
  try {
    const { prompt, add_context_from_internet = false } = req.body;
    
    // Mock LLM response
    const mockResponse = {
      response: `This is a mock AI response to: "${prompt.substring(0, 100)}..." 

Based on your query about Lumanagi's intelligence systems, here are key insights:

• System Status: All components operating normally
• Security Posture: ISO 27001 compliant with zero critical vulnerabilities  
• AI Models: Running optimally with 94% confidence scores
• Compliance: Meeting all regulatory requirements

For detailed analysis, please check the specific modules mentioned in your query.`,
      model: 'mock-llm-v1',
      tokens_used: 150,
      timestamp: new Date().toISOString()
    };
    
    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json(mockResponse);
  } catch (error) {
    console.error('LLM invoke error:', error);
    res.status(500).json({ error: 'Failed to invoke LLM' });
  }
});

router.post('/integrations/email/send', authenticateToken, (req, res) => {
  try {
    const { to, subject, body } = req.body;
    
    // Mock email send
    res.json({ 
      message: 'Email sent successfully (mock)',
      id: `email_${Date.now()}`,
      to,
      subject,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

router.post('/integrations/files/upload', authenticateToken, (req, res) => {
  try {
    // Mock file upload
    res.json({
      id: `file_${Date.now()}`,
      filename: req.body.filename || 'uploaded_file.txt',
      size: Math.floor(Math.random() * 1000000),
      url: `https://mock-storage.example.com/files/file_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.post('/integrations/images/generate', authenticateToken, (req, res) => {
  try {
    const { prompt, size = '512x512' } = req.body;
    
    // Mock image generation
    res.json({
      id: `img_${Date.now()}`,
      prompt,
      url: `https://picsum.photos/${size.replace('x', '/')}`,
      size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;