import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to OpenAlgo MultiUser
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
          A powerful platform for managing and executing trading algorithms with real-time monitoring and multi-user support.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Algorithmic Trading</h3>
          <p className="text-muted-foreground">
            Create, test, and deploy sophisticated trading algorithms using our intuitive platform. Support for multiple asset classes and exchanges.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
          <p className="text-muted-foreground">
            Track your algorithm's performance in real-time with advanced analytics, performance metrics, and customizable dashboards.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Multi-user Support</h3>
          <p className="text-muted-foreground">
            Collaborate with team members, share strategies, and manage permissions with our robust multi-user system.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
          <p className="text-muted-foreground">
            Built-in risk management tools to protect your investments. Set stop-losses, position limits, and other risk parameters.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Strategy Builder</h3>
          <p className="text-muted-foreground">
            Design trading strategies using our visual strategy builder or code them directly using Python. Backtest your strategies with historical data.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">API Integration</h3>
          <p className="text-muted-foreground">
            Connect to major exchanges and data providers through our standardized API. Easy integration with existing trading systems.
          </p>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to start trading?</h2>
        <div className="space-x-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
