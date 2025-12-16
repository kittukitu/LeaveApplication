import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useLeave } from '../hooks/useLeave';
import type { LeaveApplicationFormData, LeaveBalance } from '../types/leave.types'; // Remove LeaveApplicationPayload

interface ApplyLeaveFormProps {
  onSuccess?: () => void;
  initialBalance?: LeaveBalance;
  className?: string;
}

const ApplyLeaveForm: React.FC<ApplyLeaveFormProps> = ({
  onSuccess,
  initialBalance,
  className = ''
}) => {
  const { applyForLeave, loading, error, getLeaveBalance } = useLeave();
  const [balance, setBalance] = useState<LeaveBalance | null>(initialBalance || null);
  const [formData, setFormData] = useState<LeaveApplicationFormData>({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [workingDays, setWorkingDays] = useState(0);

  useEffect(() => {
    if (!initialBalance) {
      loadBalance();
    }
  }, []);

  useEffect(() => {
    calculateWorkingDays();
  }, [formData.startDate, formData.endDate]);

  const loadBalance = async () => {
    try {
      const balanceData = await getLeaveBalance();
      setBalance(balanceData);
    } catch (err) {
      console.error('Failed to load leave balance:', err);
    }
  };

  const calculateWorkingDays = () => {
    const { startDate, endDate } = formData;
    
    if (!startDate || !endDate) {
      setWorkingDays(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    setWorkingDays(count);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        errors.endDate = 'End date must be after start date';
      }

      if (workingDays <= 0) {
        errors.days = 'Leave must be for at least 1 working day';
      }
    }

    // Check leave balance
    if (balance && workingDays > 0) {
      const remaining = getRemainingLeaves();
      if (workingDays > remaining) {
        errors.balance = `Insufficient ${formData.leaveType} leaves. Available: ${remaining}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getRemainingLeaves = (): number => {
    if (!balance) return 0;
    
    switch (formData.leaveType) {
      case 'casual': return balance.casualRemaining;
      case 'sick': return balance.sickRemaining;
      case 'annual': return balance.annualRemaining;
      default: return 0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // ✅ Pass the form data directly (leaveType in lowercase, dates in YYYY-MM-DD)
      // The transformation to uppercase and ISO format happens in leaveApi.ts
      await applyForLeave(formData);
      
      // Reset form
      setFormData({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: ''
      });
      setWorkingDays(0);
      
      // Reload balance
      await loadBalance();
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Show success message
      alert('Leave application submitted successfully!');
    } catch (err) {
      console.error('Failed to submit leave application:', err);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const remainingLeaves = getRemainingLeaves();

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>
        <p className="text-gray-600 text-sm mt-1">Submit a new leave application</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type *
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="annual">Annual Leave</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Available: {remainingLeaves} {formData.leaveType} leaves
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.startDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || today}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.endDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason (Optional)
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter reason for leave..."
          />
        </div>

        {workingDays > 0 && (
          <div className={`p-4 rounded-lg border ${
            workingDays > remainingLeaves 
              ? 'bg-red-50 border-red-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">
                    Total Working Days: <span className="font-bold">{workingDays}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Available {formData.leaveType} leaves: <span className="font-semibold">{remainingLeaves}</span>
                  </p>
                </div>
              </div>
              {workingDays > remainingLeaves && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Insufficient leaves</span>
                </div>
              )}
            </div>
          </div>
        )}

        {formErrors.balance && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{formErrors.balance}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Apply for Leave'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeaveForm;