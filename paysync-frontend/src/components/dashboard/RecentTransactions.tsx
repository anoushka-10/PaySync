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
import { API_BASE_URL } from "@/lib/api";

// --- FIX #1: The Transaction Interface ---
// We need to match the exact field names from your backend's JSON response.
interface Transaction {
  id: string;
  transactionType: 'CREDIT' | 'DEBIT'; // Changed 'type' to 'transactionType'
  amount: number;
  timestamp: string;
  // Note: 'description' and 'status' are not in your JSON, so we will handle them in the UI.
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
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/transaction?page=0&size=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.content);
      } else {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
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

  // Note: Your JSON doesn't include a 'status', so this function might not be used right now.
  const getStatusBadge = (status: string) => {
    // ...
  };

  return (
    <Card className="fintech-card fade-in col-span-full lg:col-span-3">
      <CardHeader>
        {/* ...No changes here... */}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* ...No changes to loading/empty states... */}
          {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="transaction-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-muted/50">
                    {/* --- FIX #2: Use the correct property --- */}
                    {getTransactionIcon(transaction.transactionType)}
                  </div>
                  <div>
                    {/* Since 'description' isn't provided, we can create a default one */}
                    <p className="font-medium">
                      {transaction.transactionType === 'CREDIT' ? 'Funds Added' : 'Payment Sent'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {/* --- FIX #3: Use the correct property for logic --- */}
                  <p className={`font-semibold ${
                    transaction.transactionType === 'CREDIT' ? 'text-fintech-green' : 'text-foreground'
                  }`}>
                    {transaction.transactionType === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  {/* Since 'status' isn't provided, we can hide the badge for now */}
                  {/* {getStatusBadge(transaction.status)} */}
                </div>
              </div>
            ))
          }
        </div>
      </CardContent>
    </Card>
  );
}