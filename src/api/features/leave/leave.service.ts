import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { PrismaClient } from '@prisma/client';
import type {
  LeaveRequestInput,
  LeaveRequestResponse,
  LeaveBalanceResponse,
  LeaveStatsResponse
} from './leave.types.js';

const logger = loggerClass.get('leave');
const error = errorClass.get();
const prisma = new PrismaClient();

/* ================= HELPERS ================= */

const calculateWorkingDays = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

const mapLeaveRequest = (leave: any): LeaveRequestResponse => ({
  id: leave.id,
  leaveType: leave.leaveType,
  startDate: leave.startDate.toISOString(),
  endDate: leave.endDate.toISOString(),
  totalDays: leave.totalDays,
  reason: leave.reason,
  status: leave.status,
  userId: leave.userId,
  userName: leave.user?.name,
  userEmail: leave.user?.email,
  adminComments: leave.adminComments,
  createdAt: leave.createdAt.toISOString(),
  updatedAt: leave.updatedAt.toISOString()
});

const mapLeaveBalance = (b: any): LeaveBalanceResponse => ({
  userId: b.userId,
  casualLeaves: b.casualLeaves,
  sickLeaves: b.sickLeaves,
  annualLeaves: b.annualLeaves,
  casualTaken: b.casualTaken,
  sickTaken: b.sickTaken,
  annualTaken: b.annualTaken,
  casualRemaining: b.casualLeaves - b.casualTaken,
  sickRemaining: b.sickLeaves - b.sickTaken,
  annualRemaining: b.annualLeaves - b.annualTaken
});

const ensureLeaveBalance = async (userId: number) => {
  return prisma.leaveBalance.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      casualLeaves: 12,
      sickLeaves: 6,
      annualLeaves: 12,
      casualTaken: 0,
      sickTaken: 0,
      annualTaken: 0
    }
  });
};

const updateLeaveBalance = async (
  userId: number,
  leaveType: string,
  days: number
) => {
  const data: any = {};
  if (leaveType === 'casual') data.casualTaken = { increment: days };
  if (leaveType === 'sick') data.sickTaken = { increment: days };
  if (leaveType === 'annual') data.annualTaken = { increment: days };

  await prisma.leaveBalance.update({
    where: { userId },
    data
  });
};

/* ================= SERVICE ================= */

export const leaveService = {
  async applyForLeave(userId: number, data: LeaveRequestInput): Promise<LeaveRequestResponse> {
    try {
      const leaveType = data.leaveType.toLowerCase();
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate > endDate) {
        throw error.badRequest('Start date cannot be after end date');
      }

      const totalDays = calculateWorkingDays(startDate, endDate);
      if (totalDays <= 0) {
        throw error.badRequest('Leave must be at least 1 working day');
      }

      const balance = await ensureLeaveBalance(userId);

      if (leaveType === 'casual' && balance.casualLeaves - balance.casualTaken < totalDays) {
        throw error.badRequest('Insufficient casual leaves');
      }

      if (leaveType === 'sick' && balance.sickLeaves - balance.sickTaken < totalDays) {
        throw error.badRequest('Insufficient sick leaves');
      }

      if (leaveType === 'annual' && balance.annualLeaves - balance.annualTaken < totalDays) {
        throw error.badRequest('Insufficient annual leaves');
      }

      const leave = await prisma.leaveRequest.create({
        data: {
          userId,
          leaveType,
          startDate,
          endDate,
          totalDays,
          reason: data.reason,
          status: 'pending'
        },
        include: { user: { select: { name: true, email: true } } }
      });

      return mapLeaveRequest(leave);
    } catch (err: any) {
      if (err.statusCode) throw err;
      logger.error(err);
      throw error.serverError('Failed to apply leave');
    }
  },

  async getUserLeaves(userId: number): Promise<LeaveRequestResponse[]> {
    const leaves = await prisma.leaveRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    return leaves.map(mapLeaveRequest);
  },

  async getLeaveBalance(userId: number): Promise<LeaveBalanceResponse> {
    const balance = await ensureLeaveBalance(userId);
    return mapLeaveBalance(balance);
  },

  async getAllLeaves(): Promise<LeaveRequestResponse[]> {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    return leaves.map(mapLeaveRequest);
  },

  async updateLeaveStatus(
    leaveId: number,
    status: 'approved' | 'rejected',
    adminComments?: string
  ): Promise<LeaveRequestResponse> {
    const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
    if (!leave) throw error.notFound('Leave not found');
    if (leave.status !== 'pending') throw error.badRequest('Leave already processed');

    const updated = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status, adminComments },
      include: { user: { select: { name: true, email: true } } }
    });

    if (status === 'approved') {
      await updateLeaveBalance(leave.userId, leave.leaveType, leave.totalDays);
    }

    return mapLeaveRequest(updated);
  },

  async getLeaveStats(): Promise<LeaveStatsResponse> {
    const [total, pending, approved, rejected, balances] = await Promise.all([
      prisma.leaveRequest.count(),
      prisma.leaveRequest.count({ where: { status: 'pending' } }),
      prisma.leaveRequest.count({ where: { status: 'approved' } }),
      prisma.leaveRequest.count({ where: { status: 'rejected' } }),
      prisma.leaveBalance.findMany()
    ]);

    const totals = balances.reduce(
      (acc, b) => {
        acc.casualTaken += b.casualTaken;
        acc.sickTaken += b.sickTaken;
        acc.annualTaken += b.annualTaken;
        return acc;
      },
      { casualTaken: 0, sickTaken: 0, annualTaken: 0 }
    );

    const users = balances.length || 1;

    return {
      totalRequests: total,
      pending,
      approved,
      rejected,
      leaveBalances: {
        userId: 0,
        casualLeaves: 12 * users,
        sickLeaves: 6 * users,
        annualLeaves: 12 * users,
        casualTaken: totals.casualTaken,
        sickTaken: totals.sickTaken,
        annualTaken: totals.annualTaken,
        casualRemaining: 12 * users - totals.casualTaken,
        sickRemaining: 6 * users - totals.sickTaken,
        annualRemaining: 12 * users - totals.annualTaken
      }
    };
  }
};
