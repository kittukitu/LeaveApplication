import React from 'react';

interface LeaveStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
}

const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          dotColor: 'bg-red-500'
        };
      case 'pending':
      default:
        return {
          label: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
};

export default LeaveStatusBadge;