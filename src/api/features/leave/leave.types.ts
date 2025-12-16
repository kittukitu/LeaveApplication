export interface LeaveRequestInput {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface LeaveRequestResponse {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  adminComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalanceResponse {
  userId: number;
  casualLeaves: number;
  sickLeaves: number;
  annualLeaves: number;
  casualTaken: number;
  sickTaken: number;
  annualTaken: number;
  casualRemaining: number;
  sickRemaining: number;
  annualRemaining: number;
}

export interface LeaveStatsResponse {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  leaveBalances: LeaveBalanceResponse;
}
