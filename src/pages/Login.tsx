import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getRoleDashboardRoute, getRoleDisplayName, getAllRoles } from "@/utils/roleRoutes";
import logo from "@/assets/logo.png";
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AppRole>('member');
  const { signIn, user, roles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && roles.length > 0) {
      const dashboardRoute = getRoleDashboardRoute(roles);
      navigate(dashboardRoute, { replace: true });
    }
  }, [user, roles, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });
      // Navigation will be handled by the useEffect when roles are loaded
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: AppRole) => {
    const dashboardRoute = getRoleDashboardRoute([role]);
    toast({
      title: `Demo Mode: ${getRoleDisplayName(role)}`,
      description: `Redirecting to ${getRoleDisplayName(role)} dashboard...`
    });
    navigate(dashboardRoute);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Addis Mesob" className="h-12 w-12" />
            <div>
              <span className="text-xl font-bold text-foreground">Addis Mesob</span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">
                Savings & Loans
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Demo Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Demo Mode</span>
              <Button
                type="button"
                variant={demoMode ? "default" : "outline"}
                size="sm"
                className="ml-auto"
                onClick={() => setDemoMode(!demoMode)}
              >
                {demoMode ? "On" : "Off"}
              </Button>
            </div>
          </div>

          {demoMode ? (
            /* Demo Role Selection */
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select a role to explore the dashboard:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {getAllRoles().map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleDemoLogin(role)}
                  >
                    <span className="text-sm font-medium">{getRoleDisplayName(role)}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                This is demo mode using dummy data. Turn off demo mode to use real authentication.
              </p>
            </div>
          ) : (
            /* Real Login Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/90 via-primary to-primary/80 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg text-center text-white">
          <img src={logo} alt="Addis Mesob" className="h-20 w-20 mx-auto mb-8 drop-shadow-2xl" />
          
          <h2 className="text-3xl font-bold mb-4">
            Your Financial Partner
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of members who trust Addis Mesob for their savings and loan needs. 
            Experience secure, transparent, and community-focused financial services.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">50M+</div>
              <div className="text-sm text-white/80">Total Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">2,500+</div>
              <div className="text-sm text-white/80">Active Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-white/80">Satisfaction Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Online Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
