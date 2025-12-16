import { Router } from 'express';
import { leaveService } from './leave.service.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ✅ TEMPORARY: Simple auth check (for testing)
const checkAuth = (req: any, res: any, next: any) => {
  // For now, just check if any token exists
  const token = req.headers.authorization;
  console.log('Auth check - Authorization header:', token ? 'Present' : 'Missing');
  
  // Hardcode user for testing
  req.user = { id: 2, role: 'user' };
  next();
};

// ✅ Route: /api/leaves/apply
router.post('/apply', checkAuth, async (req: any, res) => {
  try {
    console.log('POST /leaves/apply - Body:', req.body);
    
    const userId = req.user.id;
    const { leaveType, startDate, endDate, reason } = req.body;
    
    console.log('Processing leave application:', {
      userId,
      leaveType,
      startDate,
      endDate,
      reason
    });
    
    // Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['leaveType', 'startDate', 'endDate']
      });
    }
    
    // Validate leaveType is uppercase
    const validLeaveTypes = ['CASUAL', 'SICK', 'ANNUAL'];
    if (!validLeaveTypes.includes(leaveType)) {
      return res.status(400).json({ 
        error: 'Invalid leave type',
        validTypes: validLeaveTypes,
        received: leaveType
      });
    }
    
    // Call service
    const result = await leaveService.applyForLeave(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Apply leave error:', error);
    res.status(500).json({ 
      error: 'Failed to apply for leave',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/balance
router.get('/balance', checkAuth, async (req: any, res) => {
  try {
    console.log('GET /leaves/balance - User:', req.user);
    
    const userId = req.user.id;
    console.log('Fetching balance for userId:', userId);
    
    const result = await leaveService.getLeaveBalance(userId);
    console.log('Balance result:', result);
    
    res.json(result);
  } catch (error: any) {
    console.error('Balance error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leave balance',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/my-leaves
router.get('/my-leaves', checkAuth, async (req: any, res) => {
  try {
    console.log('GET /leaves/my-leaves - User:', req.user);
    
    const userId = req.user.id;
    const result = await leaveService.getUserLeaves(userId);
    res.json(result);
  } catch (error: any) {
    console.error('My leaves error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user leaves',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/all
router.get('/all', async (req, res) => {
  try {
    const result = await leaveService.getAllLeaves();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch all leaves',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/stats
router.get('/stats', async (req, res) => {
  try {
    const result = await leaveService.getLeaveStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComments } = req.body;
    
    const result = await leaveService.updateLeaveStatus(
      parseInt(id),
      status,
      adminComments
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to update status',
      details: error.message
    });
  }
});

// ✅ Route: /api/leaves/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'leave-service',
    timestamp: new Date().toISOString(),
    routes: [
      '/apply (POST)',
      '/balance (GET)',
      '/my-leaves (GET)',
      '/all (GET)',
      '/stats (GET)',
      '/:id/status (PATCH)',
      '/health (GET)'
    ]
  });
});

// ✅ Route: /api/leaves/test
router.get('/test', (req, res) => {
  res.json({
    message: 'Leave routes are working!',
    timestamp: new Date().toISOString(),
    note: 'Check /health for all available routes'
  });
});

export default router;