import React from 'react';
import { Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import type { LeaveBalance } from '../types/leave.types';

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
  className?: string;
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balance, className = '' }) => {
  const leaveTypes = [
    {
      key: 'casual' as const,
      label: 'Casual Leaves',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      color: 'blue',
      total: balance.casualLeaves,
      taken: balance.casualTaken,
      remaining: balance.casualRemaining
    },
    {
      key: 'sick' as const,
      label: 'Sick Leaves',
      icon: <AlertCircle className="h-5 w-5 text-purple-500" />,
      color: 'purple',
      total: balance.sickLeaves,
      taken: balance.sickTaken,
      remaining: balance.sickRemaining
    },
    {
      key: 'annual' as const,
      label: 'Annual Leaves',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      color: 'green',
      total: balance.annualLeaves,
      taken: balance.annualTaken,
      remaining: balance.annualRemaining
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          darkText: 'text-blue-800'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          darkText: 'text-purple-800'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          darkText: 'text-green-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          darkText: 'text-gray-800'
        };
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800">Leave Balance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveTypes.map((type) => {
          const colors = getColorClasses(type.color);
          const percentage = type.total > 0 ? Math.round((type.taken / type.total) * 100) : 0;

          return (
            <div
              key={type.key}
              className={`border rounded-lg p-4 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {type.icon}
                  <span className={`font-medium ${colors.darkText}`}>
                    {type.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={colors.text}>Total</span>
                    <span className="font-semibold">{type.total}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={colors.text}>Taken</span>
                    <span className="font-semibold">{type.taken}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={colors.text}>Remaining</span>
                    <span className={`font-bold ${type.remaining > 0 ? colors.darkText : 'text-red-600'}`}>
                      {type.remaining}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Usage</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        type.color === 'blue' ? 'bg-blue-500' :
                        type.color === 'purple' ? 'bg-purple-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveBalanceCard;