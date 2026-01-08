"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { userId, isAdmin, logout, loading } = useAuth();

  // avoid flicker while loading auth
  if (loading) return null;

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Loan<span className="text-blue-600">OS</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {userId && (
            <>
              {/* Role badge */}
              <Badge variant={isAdmin ? "destructive" : "secondary"}>
                {isAdmin ? "Admin" : "Customer"}
              </Badge>

              {/* Navigation */}
              {!isAdmin && (
                <>
                  <Link href="/user">
                    <Button variant="ghost">User Dashboard</Button>
                  </Link>

                  <Link href="/user/application">
                    <Button variant="ghost">New Application</Button>
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost">Admin Panel</Button>
                </Link>
              )}

              {/* Logout */}
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          )}

          {!userId && (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
