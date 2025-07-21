import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthPage } from "./AuthPage";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";
import { AddMoneyForm } from "@/components/wallet/AddMoneyForm";
import { SendMoneyForm } from "@/components/wallet/SendMoneyForm";
import { TransactionHistory } from "@/components/transactions/TransactionHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, TrendingUp } from "lucide-react";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check for stored token on component mount
    const storedToken = localStorage.getItem('paysync_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('paysync_token', newToken);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('paysync_token');
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleFormSuccess = () => {
    setCurrentView('dashboard');
  };

  // If not authenticated, show landing or auth page
  if (!token) {
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard token={token} onViewChange={handleViewChange} />;
      
      case 'add-money':
        return (
          <div className="max-w-2xl mx-auto fade-in">
            <AddMoneyForm 
              token={token}
              onSuccess={handleFormSuccess}
              onCancel={() => setCurrentView('dashboard')}
            />
          </div>
        );
      
      case 'send-money':
        return (
          <div className="max-w-2xl mx-auto fade-in">
            <SendMoneyForm 
              token={token}
              onSuccess={handleFormSuccess}
              onCancel={() => setCurrentView('dashboard')}
            />
          </div>
        );
      
      case 'transactions':
        return <TransactionHistory token={token} />;
      
      case 'analytics':
        return (
          <div className="max-w-4xl mx-auto fade-in">
            <Card className="fintech-card text-center py-12">
              <CardContent>
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
                <p className="text-muted-foreground">
                  Advanced analytics and insights coming soon. Track your spending patterns, 
                  savings goals, and financial growth.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto fade-in">
            <Card className="fintech-card text-center py-12">
              <CardContent>
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">
                  Account settings, security preferences, and notification controls 
                  will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <Dashboard token={token} onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
