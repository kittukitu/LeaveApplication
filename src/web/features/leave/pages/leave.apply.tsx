import React, { useState, useEffect } from 'react';
import { PageLayout } from '@voilajsx/uikit/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@voilajsx/uikit/card';
import { Button } from '@voilajsx/uikit/button'; // Use voilajsx button
import { ArrowLeft, Calendar } from 'lucide-react';
import { Header, Footer, SEO } from '../../../shared/components';
import { useAuth } from '../../auth';
import { useLeave } from '../hooks/useLeave';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import ApplyLeaveForm from '../components/ApplyLeaveForm';
import type { LeaveBalance } from '../types/leave.types';

const LeaveApplyPage: React.FC = () => {
  const { user } = useAuth();
  const { getLeaveBalance } = useLeave();
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      setLoading(true);
      const data = await getLeaveBalance();
      setBalance(data);
    } catch (error) {
      console.error('Failed to load leave balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSuccess = () => {
    loadBalance();
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <SEO
        title="Apply for Leave"
        description="Submit a new leave application"
      />
      <Header />

      <PageLayout.Content>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                Apply for Leave
              </h1>
              <p className="text-muted-foreground">
                Submit a new leave application
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Leave Balance */}
          {!loading && balance && (
            <LeaveBalanceCard balance={balance} />
          )}

          {/* Apply Leave Form */}
          <Card>
            <CardHeader>
              <CardTitle>New Leave Application</CardTitle>
              <CardDescription>
                Fill in the details below to apply for leave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplyLeaveForm
                onSuccess={handleLeaveSuccess}
                initialBalance={balance || undefined}
              />
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>Leave applications require approval from your manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>Sick leaves may require medical certificates for more than 2 consecutive days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>Apply at least 3 working days in advance for planned leaves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">•</span>
                  <span>Weekends (Saturday and Sunday) are excluded from leave calculations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageLayout.Content>

      <Footer />
    </PageLayout>
  );
};

export default LeaveApplyPage;