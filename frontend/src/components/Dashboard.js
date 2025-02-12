import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { LogOut, LineChart, Settings, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">OpenAlgo</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="h-8 sm:h-10 text-sm sm:text-base flex items-center"
              >
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Welcome back, {user?.username}! 👋</CardTitle>
              <CardDescription className="text-sm sm:text-base">Here's what's happening with your algorithms today.</CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Algorithms</CardTitle>
                <LineChart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Start creating your first algorithm
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active Trades</CardTitle>
                <LineChart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No active trades yet
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
                <LineChart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  Start trading to see your success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Returns</CardTitle>
                <LineChart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">₹0.00</div>
                <p className="text-xs text-muted-foreground">
                  Start trading to track your returns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with these common tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="w-full justify-start">
                  <LineChart className="mr-2 h-4 w-4" />
                  Create New Algorithm
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No recent activity to show.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
