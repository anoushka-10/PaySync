import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMoneyFormProps {
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddMoneyForm({ token, onSuccess, onCancel }: AddMoneyFormProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateIdempotencyKey = () => {
    return `add_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (!amount.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amountNum > 10000) {
      toast({
        title: "Error",
        description: "Maximum amount per transaction is $10,000",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/wallet/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountNum,
          idempotencyKey: generateIdempotencyKey(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `$${amountNum.toFixed(2)} added to your wallet successfully!`,
          variant: "default",
        });
        onSuccess();
      } else {
        throw new Error('Failed to add money');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <Card className="fintech-card max-w-md mx-auto fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-fintech-blue to-fintech-teal rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Add Money</CardTitle>
        <CardDescription>Top up your PaySync wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Amount Buttons */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick amounts</Label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-sm"
                disabled={isLoading}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="pl-10 text-lg font-semibold"
                min="0"
                step="0.01"
                max="10000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: $1.00 • Maximum: $10,000.00
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              disabled={isLoading || !amount}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Money"
              )}
            </Button>
          </div>
        </form>

        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">💳 Payment Methods</p>
          <p className="text-muted-foreground">
            Funds will be instantly available in your wallet. All transactions are secured with bank-level encryption.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}