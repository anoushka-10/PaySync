import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Globe, CreditCard, Users, TrendingUp } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-fintech-teal/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-fintech-purple/10 rounded-full blur-xl animate-pulse"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-fintech-teal to-fintech-purple bg-clip-text text-transparent animate-fade-in">
              PaySync
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              Modern Fintech Wallet Platform
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              Experience seamless money transfers, secure wallet management, and advanced financial analytics. 
              Join the future of digital payments today.
            </p>
            
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="text-lg px-8 py-4 hover-scale animate-fade-in"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose PaySync?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure & Safe</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and advanced security protocols protect your financial data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-fintech-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Instant transfers and real-time transaction processing for seamless payments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-fintech-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Send money worldwide with competitive exchange rates and low fees.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Wallet</h3>
                <p className="text-muted-foreground">
                  Manage multiple currencies and payment methods in one intelligent wallet.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-fintech-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Split bills, request money, and send payments with just a few taps.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card hover-scale">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-fintech-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Financial Insights</h3>
                <p className="text-muted-foreground">
                  Track spending, set budgets, and get personalized financial advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who trust PaySync for their digital payment needs.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 hover-scale"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}