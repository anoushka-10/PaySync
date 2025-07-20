import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  History, 
  UserPlus, 
  Settings,
  ChartLine,
  Shield
} from "lucide-react";

interface QuickActionsProps {
  onAddMoney: () => void;
  onSendMoney: () => void;
  onViewTransactions: () => void;
}

export function QuickActions({ onAddMoney, onSendMoney, onViewTransactions }: QuickActionsProps) {
  const actions = [
    {
      title: "Add Money",
      description: "Top up your wallet",
      icon: CreditCard,
      onClick: onAddMoney,
      gradient: "from-fintech-blue to-fintech-teal"
    },
    {
      title: "Send Money",
      description: "Transfer to friends",
      icon: UserPlus,
      onClick: onSendMoney,
      gradient: "from-fintech-teal to-fintech-purple"
    },
    {
      title: "Transaction History",
      description: "View all transactions",
      icon: History,
      onClick: onViewTransactions,
      gradient: "from-fintech-purple to-fintech-blue"
    },
    {
      title: "Analytics",
      description: "Coming soon",
      icon: ChartLine,
      onClick: () => {},
      gradient: "from-fintech-green to-fintech-teal",
      disabled: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 fade-in">
      {actions.map((action, index) => (
        <Card 
          key={action.title} 
          className="fintech-card hover:scale-105 transition-all duration-300 cursor-pointer group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
              <CardDescription className="text-xs">{action.description}</CardDescription>
            </div>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.disabled ? "Coming Soon" : "Quick Action →"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}