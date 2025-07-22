import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, DollarSign, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface SendMoneyFormProps {
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SendMoneyForm({ token, onSuccess, onCancel }: SendMoneyFormProps) {
  const [receiverUsername, setReceiverUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateIdempotencyKey = () => {
    return `send_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (!receiverUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter the recipient's username",
        variant: "destructive",
      });
      return;
    }

    if (!amount.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amountNum > 5000) {
      toast({
        title: "Error",
        description: "Maximum transfer amount is $5,000",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Idempotency-Key': generateIdempotencyKey(), // The key is now in the header
        },
        body: JSON.stringify({
          receiverUsername: receiverUsername.trim(),
          amount: amountNum,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `$${amountNum.toFixed(2)} sent to @${receiverUsername} successfully!`,
          variant: "default",
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send money');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [25, 50, 100, 250];

  return (
    <Card className="fintech-card max-w-md mx-auto fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-fintech-teal to-fintech-purple rounded-full flex items-center justify-center mb-4">
          <Send className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Send Money</CardTitle>
        <CardDescription>Transfer money to another PaySync user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiverUsername">Recipient Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="receiverUsername"
                type="text"
                placeholder="Enter username"
                value={receiverUsername}
                onChange={(e) => setReceiverUsername(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the exact username without @ symbol
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-sm"
                  disabled={isLoading}
                  type="button"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

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
                max="5000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: $1.00 • Maximum: $5,000.00
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              type="text"
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
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
              disabled={isLoading || !receiverUsername || !amount}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Money"
              )}
            </Button>
          </div>
        </form>

        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">🔒 Security Notice</p>
          <p className="text-muted-foreground">
            All transfers are instant and secure. Please verify the recipient username before sending.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}