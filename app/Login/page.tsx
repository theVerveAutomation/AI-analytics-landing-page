"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import vapLogo from "@/assets/vap-logo.jpeg";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Login attempted with:", { organizationId, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Button
        variant="ghost"
        onClick={() => redirect("/")}
        className="absolute top-6 left-6 text-foreground/80 hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Button>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image
              src={vapLogo}
              alt="VAP Logo"
              className="h-16 w-auto rounded-md"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to your account to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationId" className="text-sm font-medium">
                Organization ID
              </Label>
              <Input
                id="organizationId"
                type="text"
                placeholder="Enter your organization ID"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-glow hover:shadow-glow-lg transition-all duration-300 font-semibold text-base"
            >
              Sign In
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                href="/bookdemo"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Request Access
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
