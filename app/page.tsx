"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* HERO SECTION */}
      <section className="px-8 py-16 text-center">
        <Badge className="mb-3" variant="secondary">
          Loan Origination System
        </Badge>

        <h2 className="text-4xl font-bold tracking-tight mb-4 max-w-3xl mx-auto">
          Fast-Track Your Loan Application —
          <span className="text-blue-600"> Simple, Transparent, Automated</span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Apply for a personal loan in minutes. Complete your KYC, credit check,
          and eligibility verification — all in one seamless workflow.
        </p>
        
        <div className="space-x-3">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>

          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="px-8 pb-20 max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🔐 Secure Login</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            JWT-based authentication to keep your account and data safe.
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>📝 Easy Application</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Fill out your loan application with a clean and simple form.
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🪪 KYC Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Instant rule-based KYC checks to validate your identity.
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🏦 Credit Bureau Check</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Mock CIBIL scoring to evaluate your creditworthiness.
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>📊 Eligibility Engine</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            EMI-based income analysis to determine final loan approval.
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🛠 Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Manage, monitor, and review applications in one place.
          </CardContent>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        Built with ❤️ using Next.js, FastAPI, PostgreSQL
      </footer>
    </main>
  );
}
