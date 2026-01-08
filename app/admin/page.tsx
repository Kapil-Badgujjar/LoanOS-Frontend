"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [eligible, setEligible] = useState("");

  const load = async () => {
    const params: any = {};
    if (status) params.status = status;
    if (eligible) params.eligible = eligible;

    const res = await api.get("/admin/applications", { params });
    setApps(res.data);
  };

  useEffect(() => {
    load();
  }, [status, eligible]);

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Review and manage all loan applications
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <select
              className="border rounded-md p-2 bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="KYC_PENDING">KYC_PENDING</option>
              <option value="KYC_COMPLETED">KYC_COMPLETED</option>
              <option value="CREDIT_CHECK_PENDING">CREDIT_CHECK_PENDING</option>
              <option value="CREDIT_CHECK_COMPLETED">CREDIT_CHECK_COMPLETED</option>
              <option value="ELIGIBLE">ELIGIBLE</option>
              <option value="NOT_ELIGIBLE">NOT_ELIGIBLE</option>
            </select>

            <select
              className="border rounded-md p-2 bg-white"
              value={eligible}
              onChange={(e) => setEligible(e.target.value)}
            >
              <option value="">All Applications</option>
              <option value="true">Eligible Only</option>
              <option value="false">Not Eligible Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          {apps.length === 0 ? (
            <p className="text-gray-500">No applications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">Applicant</th>
                    <th className="p-3">PAN</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {apps.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b hover:bg-slate-100 transition"
                    >
                      <td className="p-3 font-medium">{a.id}</td>
                      <td className="p-3">{a.full_name}</td>
                      <td className="p-3">{a.pan}</td>
                      <td className="p-3">
                        <Badge className={statusColor(a.status)}>
                          {a.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/admin/${a.id}`)
                          }
                        >
                          View Journey
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
