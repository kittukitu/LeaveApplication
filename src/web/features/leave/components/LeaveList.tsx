import React from 'react';
import { Calendar, User, MessageSquare } from 'lucide-react';
import LeaveStatusBadge from './LeaveStatusBadge';
import type { LeaveRequest } from '../types/leave.types';

interface LeaveListProps {
  leaves: LeaveRequest[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onStatusUpdate?: (leaveId: number, status: 'approved' | 'rejected') => void;
  className?: string;
}

const LeaveList: React.FC<LeaveListProps> = ({
  leaves,
  isLoading = false,
  isAdmin = false,
  onStatusUpdate,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'casual':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sick':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'annual':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading leave requests...</span>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className={`text-center p-8 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Leave Requests</h3>
        <p className="text-gray-500">No leave requests found</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied On
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.userName || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {leave.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </div>
                    {leave.reason && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{leave.reason}</span>
                      </div>
                    )}
                    {leave.adminComments && (
                      <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded border">
                        <span className="font-medium">Admin Comment:</span> {leave.adminComments}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {leave.totalDays}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <LeaveStatusBadge status={leave.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(leave.createdAt)}
                </td>
                {isAdmin && leave.status === 'pending' && onStatusUpdate && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStatusUpdate(leave.id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusUpdate(leave.id, 'rejected')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveList;