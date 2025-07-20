import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

interface RecentTransactionsProps {
  token: string;
  onViewAll: () => void;
}

export function RecentTransactions({ token, onViewAll }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/transactions/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Show only recent 5 transactions
        setTransactions(data.slice(0, 5));
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return <ArrowDownLeft className="h-4 w-4 text-fintech-green" />;
      case 'DEBIT':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-fintech-green">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="fintech-card fade-in col-span-full lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
          <MoreHorizontal className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="transaction-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-muted/50">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'CREDIT' ? 'text-fintech-green' : 'text-foreground'
                  }`}>
                    {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}