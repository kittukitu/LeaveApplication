import React, { useState, useEffect } from 'react';
import { PageLayout } from '@voilajsx/uikit/page';
import { Card, CardContent, CardHeader, CardTitle } from '@voilajsx/uikit/card';
import { Button } from '@voilajsx/uikit/button';
import { Shield, Filter, RefreshCw, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { Header, Footer, SEO } from '../../../shared/components';
import { useAuth } from '../../auth';
import { useLeave } from '../hooks/useLeave';
import LeaveList from '../components/LeaveList';
import type { LeaveRequest, LeaveStats } from '../types/leave.types';

const LeaveAdminPage: React.FC = () => {
  const { user } = useAuth();
  const { getAllLeaves, getLeaveStats, updateLeaveStatus } = useLeave();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<LeaveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leavesData, statsData] = await Promise.all([
        getAllLeaves(),
        getLeaveStats()
      ]);
      setLeaves(leavesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleStatusUpdate = async (leaveId: number, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${status} this leave request?`)) {
      return;
    }

    // Handle null from prompt
    const adminCommentsInput = prompt('Add comments (optional):');
    const adminComments = adminCommentsInput ? adminCommentsInput : undefined;

    try {
      setUpdatingId(leaveId);
      await updateLeaveStatus(leaveId, { status, adminComments });
      await loadData();
      alert(`Leave request ${status} successfully!`);
    } catch (error) {
      alert('Failed to update leave status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageLayout>
      <SEO
        title="Leave Management Admin"
        description="Admin panel for managing employee leave requests"
      />
      <Header />

      <PageLayout.Content>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Shield className="h-8 w-8" />
                Leave Management Admin
              </h1>
              <p className="text-muted-foreground">
                Manage all employee leave requests
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold">{stats.totalRequests}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leave Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Leave Requests</CardTitle>
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
                  All Requests
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('pending')}
                >
                  Pending Review
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
                isAdmin={true}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Casual Leaves Used</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {stats?.leaveBalances.casualTaken || 0}
                    </div>
                    <div className="text-sm text-blue-700">
                      of {stats?.leaveBalances.casualLeaves || 12} total
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-purple-800">Sick Leaves Used</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {stats?.leaveBalances.sickTaken || 0}
                    </div>
                    <div className="text-sm text-purple-700">
                      of {stats?.leaveBalances.sickLeaves || 6} total
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-800">Annual Leaves Used</div>
                    <div className="text-2xl font-bold text-green-900">
                      {stats?.leaveBalances.annualTaken || 0}
                    </div>
                    <div className="text-sm text-green-700">
                      of {stats?.leaveBalances.annualLeaves || 0} total
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout.Content>

      <Footer />
    </PageLayout>
  );
};

export default LeaveAdminPage;