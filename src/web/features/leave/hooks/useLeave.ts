import { useState, useCallback } from 'react';
import { leaveApi } from '../services/leave.api';
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStats,
  LeaveApplicationFormData,
  LeaveStatusUpdateData
} from '../types/leave.types';

export const useLeave = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLeaveBalance = useCallback(async (): Promise<LeaveBalance> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useLeave: Fetching leave balance');
      
      // Test connection first
      try {
        const health = await leaveApi.testConnection();
        console.log('Backend health:', health);
      } catch (err) {
        console.warn('Health check failed, continuing anyway:', err);
      }
      
      const result = await leaveApi.getLeaveBalance();
      console.log('useLeave: Got balance:', result);
      return result;
    } catch (err: any) {
      console.error('useLeave: Balance error:', err);
      
      let errorMsg = 'Failed to fetch leave balance';
      
      if (err.response?.status === 404) {
        errorMsg = `Route not found: ${err.config?.url}. Check if backend has /leave routes.`;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ... other methods remain similar but use the corrected routes
  const applyForLeave = useCallback(async (formData: LeaveApplicationFormData): Promise<LeaveRequest> => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaveApi.applyForLeave(formData);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to apply for leave';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyLeaves = useCallback(async (): Promise<LeaveRequest[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaveApi.getMyLeaves();
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch leave requests';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllLeaves = useCallback(async (): Promise<LeaveRequest[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaveApi.getAllLeaves();
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch all leave requests';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLeaveStats = useCallback(async (): Promise<LeaveStats> => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaveApi.getLeaveStats();
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch leave statistics';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLeaveStatus = useCallback(async (
    leaveId: number, 
    data: LeaveStatusUpdateData
  ): Promise<LeaveRequest> => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaveApi.updateLeaveStatus(leaveId, data);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update leave status';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    applyForLeave,
    getMyLeaves,
    getLeaveBalance,
    getAllLeaves,
    getLeaveStats,
    updateLeaveStatus,
    clearError
  };
};