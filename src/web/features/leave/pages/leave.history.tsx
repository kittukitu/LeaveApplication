import React, { useState, useEffect } from 'react';
import { PageLayout } from '@voilajsx/uikit/page';
import { Card, CardContent, CardHeader, CardTitle } from '@voilajsx/uikit/card';
import { Button } from '@voilajsx/uikit/button'; // Use voilajsx button
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { Header, Footer, SEO } from '../../../shared/components';
import { useAuth } from '../../auth';
import { useLeave } from '../hooks/useLeave';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LeaveList from '../components/LeaveList';
import type { LeaveRequest, LeaveBalance } from '../types/leave.types';

const LeaveHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { getMyLeaves, getLeaveBalance } = useLeave();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leavesData, balanceData] = await Promise.all([
        getMyLeaves(),
        getLeaveBalance()
      ]);
      setLeaves(leavesData);
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  const stats = {
    all: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <SEO
        title="Leave History"
        description="View your leave application history and balance"
      />
      <Header />

      <PageLayout.Content>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                My Leave History
              </h1>
              <p className="text-muted-foreground">
                Track all your leave applications and balance
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => window.location.href = '/leave/leave.apply'}
              >
                Apply for Leave
              </Button>
            </div>
          </div>

          {/* Leave Balance */}
          {balance && <LeaveBalanceCard balance={balance} />}

          {/* Statistics and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Applications</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  <div className="text-2xl font-bold">{stats.all}</div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    filter === 'pending'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('pending')}
                >
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    filter === 'approved'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('approved')}
                >
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    filter === 'rejected'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setFilter('rejected')}
                >
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All Leaves
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    filter === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('approved')}
                >
                  Approved
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    filter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('rejected')}
                >
                  Rejected
                </button>
              </div>

              {/* Leave List */}
              <LeaveList
                leaves={filteredLeaves}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </PageLayout.Content>

      <Footer />
    </PageLayout>
  );
};

export default LeaveHistoryPage;