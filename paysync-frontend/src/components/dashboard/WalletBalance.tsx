import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, Send, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletBalanceProps {
  token: string;
  onAddMoney: () => void;
  onSendMoney: () => void;
}

export function WalletBalance({ token, onAddMoney, onSendMoney }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wallet balance",
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

  return (
    <Card className="balance-card fintech-card col-span-full lg:col-span-2 fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold text-white">Total Balance</CardTitle>
          <CardDescription className="text-white/80">Your PaySync wallet</CardDescription>
        </div>
        <Wallet className="h-8 w-8 text-white" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            {isLoading ? (
              <div className="h-12 w-48 bg-white/20 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-bold text-white pulse-glow">
                {balance !== null ? formatCurrency(balance) : '---'}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={onAddMoney}
              variant="secondary"
              size="lg"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Money
            </Button>
            <Button
              onClick={onSendMoney}
              variant="secondary"
              size="lg"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Money
            </Button>
          </div>
          
          <div className="flex items-center text-white/80 text-sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Wallet is secure and protected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}