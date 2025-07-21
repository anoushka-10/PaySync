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
  type: 'CREDIT' | 'DEBIT';
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
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
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
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.receiverUsername && t.receiverUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.senderUsername && t.senderUsername.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    <div className="space-y-6 fade-in">
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
              <CardDescription>View and filter your wallet transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CREDIT">Money In</SelectItem>
                <SelectItem value="DEBIT">Money Out</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                    <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Your transaction history will appear here"}
                </p>
              </div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="transaction-item p-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-muted/50">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-base">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(transaction.timestamp)}</span>
                        {transaction.receiverUsername && (
                          <span>• to @{transaction.receiverUsername}</span>
                        )}
                        {transaction.senderUsername && (
                          <span>• from @{transaction.senderUsername}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'CREDIT' ? 'text-fintech-green' : 'text-foreground'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination could be added here */}
          {filteredTransactions.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}