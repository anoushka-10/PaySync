import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  Search,
  Filter,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Transaction {
  id: string;
  // FIX 1: The interface now expects 'transactionType' to match the backend.
  transactionType: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  receiverUsername?: string;
  senderUsername?: string;
}

interface TransactionHistoryProps {
  token: string;
}

export function TransactionHistory({ token }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
        fetchTransactions();
    }
  }, [token]); // Added token dependency

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // FIX 2: This URL should point to your working endpoint.
      // We also add pagination to fetch all transactions.
      const response = await fetch(`${API_BASE_URL}/transaction?page=0&size=100`, { // Assuming you want up to 100 transactions
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // The backend sends a paginated object. The data is in 'content'.
        setTransactions(data.content);
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transaction history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      // The 'description' field is missing from your backend response.
      // You might need to adjust this filter later.
      filtered = filtered.filter(t =>
        (t.receiverUsername && t.receiverUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.senderUsername && t.senderUsername.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      // FIX 3: Filter by 'transactionType' instead of 'type'.
      filtered = filtered.filter(t => t.transactionType === typeFilter);
    }

    if (statusFilter !== "all") {
        // The 'status' field is also missing from your backend response.
        // This filter will not work until that field is added.
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  // ... (formatCurrency, formatDate, and getStatusBadge functions are correct) ...

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return <ArrowDownLeft className="h-5 w-5 text-fintech-green" />;
      case 'DEBIT':
        return <ArrowUpRight className="h-5 w-5 text-orange-500" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <Card className="fintech-card">
        {/* ... CardHeader and Filters are mostly fine, though status filter won't work yet ... */}
        <CardContent>
            {/* ... Filters section ... */}
            <div className="space-y-3">
            {isLoading ? (
                <p>Loading...</p>
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">No transactions found.</div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="transaction-item p-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-muted/50">
                      {/* FIX 4: Pass the correct property to the icon function. */}
                      {getTransactionIcon(transaction.transactionType)}
                    </div>
                    <div className="flex-1">
                      {/* Description is missing from your backend response. */}
                      <p className="font-medium text-base">{transaction.transactionType === 'CREDIT' ? 'Money Received' : 'Money Sent'}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {/* ... */}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      // FIX 5: Use 'transactionType' for the color and the sign.
                      transaction.transactionType === 'CREDIT' ? 'text-fintech-green' : 'text-foreground'
                    }`}>
                      {transaction.transactionType === 'CREDIT' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
                    </p>
                    {/* Status is missing from your backend response. */}
                    {/* <div className="mt-1">{getStatusBadge(transaction.status)}</div> */}
                  </div>
                </div>
              ))
            )}
          </div>
            {/* ... Pagination section ... */}
        </CardContent>
      </Card>
    </div>
  );
}