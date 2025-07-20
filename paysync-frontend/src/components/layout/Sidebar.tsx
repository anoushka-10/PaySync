import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Wallet, 
  History, 
  Settings, 
  LogOut, 
  Menu,
  X,
  CreditCard,
  Send,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-money', label: 'Add Money', icon: CreditCard },
    { id: 'send-money', label: 'Send Money', icon: Send },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">PaySync</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-muted"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start transition-all duration-200",
              isCollapsed ? "px-2" : "px-4",
              currentView === item.id && "bg-primary text-primary-foreground shadow-lg"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={onLogout}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}