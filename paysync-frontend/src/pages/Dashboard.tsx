import { WalletBalance } from "@/components/dashboard/WalletBalance";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

interface DashboardProps {
  token: string;
  onViewChange: (view: string) => void;
}

export function Dashboard({ token, onViewChange }: DashboardProps) {
  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's what's happening with your wallet today.</p>
      </div>

      {/* Balance Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <WalletBalance 
          token={token}
          onAddMoney={() => onViewChange('add-money')}
          onSendMoney={() => onViewChange('send-money')}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onAddMoney={() => onViewChange('add-money')}
        onSendMoney={() => onViewChange('send-money')}
        onViewTransactions={() => onViewChange('transactions')}
      />

      {/* Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentTransactions 
          token={token}
          onViewAll={() => onViewChange('transactions')}
        />
      </div>
    </div>
  );
}