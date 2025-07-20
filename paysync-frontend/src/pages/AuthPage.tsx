import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

interface AuthPageProps {
  onLogin: (token: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-fintech-teal/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-fintech-purple/10 rounded-full blur-xl"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {isLogin ? (
          <LoginForm 
            onLogin={onLogin}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onRegister={() => setIsLogin(true)}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}