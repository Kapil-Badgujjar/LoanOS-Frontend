"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusColor = (status: string) => {
  switch (status) {
    case "ELIGIBLE":
      return "bg-green-100 text-green-700";
    case "NOT_ELIGIBLE":
      return "bg-red-100 text-red-700";
    case "KYC_COMPLETED":
    case "CREDIT_CHECK_COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "KYC_PENDING":
    case "CREDIT_CHECK_PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { userId, loading } = useAuth();

  const [apps, setApps] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // wait until auth is resolved
    if (loading) return;

    // not logged in → redirect
    if (!userId) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await api.get("/applications");
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [loading, userId, router]);

  if (loading || fetching) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen px-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Applications
          </h1>
          <p className="text-gray-600 mt-1">
            Track your loan application progress
          </p>
        </div>

        <Button onClick={() => router.push("/user/application")}>
          New Application
        </Button>
      </div>

      {/* Applications */}
      {apps.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            You haven’t applied for any loans yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application #{a.id}</span>
                  <Badge className={statusColor(a.status)}>
                    {a.status}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p><b>Name:</b> {a.full_name}</p>
                <p><b>PAN:</b> {a.pan}</p>

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => router.push(`/user/application/${a.id}`)}
                >
                  View Workflow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
