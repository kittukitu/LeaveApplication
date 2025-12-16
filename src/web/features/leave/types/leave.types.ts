export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: 'casual' | 'sick' | 'annual';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
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

export interface ResetBalanceResponse {
  message: string;
  balance: LeaveBalance;
}

export interface LeaveStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  leaveBalances: LeaveBalance;
}

// For frontend form (lowercase)
export interface LeaveApplicationFormData {
  leaveType: 'casual' | 'sick' | 'annual';
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  reason?: string;
}

// For backend API (uppercase)
export interface LeaveApplicationPayload {
  leaveType: 'CASUAL' | 'SICK' | 'ANNUAL';
  startDate: string; // ISO string
  endDate: string; // ISO string
  reason?: string;
}

export interface LeaveStatusUpdateData {
  status: 'approved' | 'rejected';
  adminComments?: string;
}

// Utility type for type conversion
export type LeaveTypeLower = 'casual' | 'sick' | 'annual';
export type LeaveTypeUpper = 'CASUAL' | 'SICK' | 'ANNUAL';