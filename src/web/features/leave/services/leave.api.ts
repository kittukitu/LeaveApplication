import axios from 'axios';
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStats,
  LeaveApplicationFormData,
  LeaveStatusUpdateData
} from '../types/leave.types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    data: config.data
  });
  
  // Add token if exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Added Authorization header');
  } else {
    console.log('⚠️ No token found in localStorage');
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'No response'} ${error.config?.url}`, {
      error: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const leaveApi = {
  // ✅ Use /leave (singular) instead of /leaves (plural)
  applyForLeave: async (formData: LeaveApplicationFormData): Promise<LeaveRequest> => {
    console.log('API: Applying for leave');
    
    const payload = {
      leaveType: formData.leaveType.toUpperCase(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      reason: formData.reason || ''
    };
    
    const response = await api.post('/leave/apply', payload); // ✅ /leave/apply
    return response.data;
  },

  getMyLeaves: async (): Promise<LeaveRequest[]> => {
    console.log('API: Fetching my leaves');
    const response = await api.get('/leave/my-leaves'); // ✅ /leave/my-leaves
    return response.data;
  },

  getLeaveBalance: async (): Promise<LeaveBalance> => {
    console.log('API: Fetching leave balance');
    const response = await api.get('/leave/balance'); // ✅ /leave/balance
    return response.data;
  },

  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    console.log('API: Fetching all leaves');
    const response = await api.get('/leave/all'); // ✅ /leave/all
    return response.data;
  },

  getLeaveStats: async (): Promise<LeaveStats> => {
    console.log('API: Fetching leave stats');
    const response = await api.get('/leave/stats'); // ✅ /leave/stats
    return response.data;
  },

  updateLeaveStatus: async (leaveId: number, data: LeaveStatusUpdateData): Promise<LeaveRequest> => {
    console.log('API: Updating leave status');
    const response = await api.put(`/leave/${leaveId}/status`, data); // ✅ /leave/:id/status
    return response.data;
  },
  
  // Test endpoint
  testConnection: async (): Promise<any> => {
    console.log('API: Testing connection');
    try {
      const response = await api.get('/leave/health'); // ✅ /leave/health
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};