"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BarChart, Code, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
import { Code, Eye, EyeOff } from "lucide-react";
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg pb-0">
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            <Code className="w-6 h-6" />
            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Create an account
              </h2>
              <p className="text-muted-foreground">
                Welcome! Create an account to get started.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Conditions
                </Link>
              </label>
            </div>

            <Button className="w-full bg-primary text-primary-foreground">
              Create free account
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t !py-4">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="#" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
