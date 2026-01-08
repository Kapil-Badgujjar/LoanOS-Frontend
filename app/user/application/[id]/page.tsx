"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const steps = [
  "DRAFT",
  "KYC_PENDING",
  "KYC_COMPLETED",
  "CREDIT_CHECK_PENDING",
  "CREDIT_CHECK_COMPLETED",
  "ELIGIBLE",
];

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

export default function ApplicationWorkflow() {
  const { id } = useParams();
  const router = useRouter();
  const { userId, loading } = useAuth();

  const [data, setData] = useState<any>(null);

  /* -------- Route protection -------- */
  useEffect(() => {
    if (loading) return;

    if (!userId) {
      router.push("/login");
    }
  }, [loading, userId, router]);

  /* -------- Load data -------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  if (!data) {
    return <div className="p-8 text-gray-500">Loading application...</div>;
  }

  const app = data.application;
  const kyc = data.kyc_result;
  const credit = data.credit_result;

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Application #{app.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Track your loan application progress
            </p>
          </div>

          <Badge className={statusColor(app.status)}>
            {app.status}
          </Badge>
        </div>

        {/* Progress Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              {steps.map((step) => (
                <Badge
                  key={step}
                  variant={
                    step === app.status
                      ? "default"
                      : steps.indexOf(step) <
                        steps.indexOf(app.status)
                      ? "secondary"
                      : "outline"
                  }
                >
                  {step.replace("_", " ")}
                </Badge>
              ))}

              {app.status === "NOT_ELIGIBLE" && (
                <Badge className="bg-red-100 text-red-700">
                  NOT ELIGIBLE
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applicant Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <p><b>Name:</b> {app.full_name}</p>
            <p><b>Mobile:</b> {app.mobile}</p>
            <p><b>PAN:</b> {app.pan}</p>
            <p><b>Employment:</b> {app.employment_type}</p>
            <p><b>Monthly Income:</b> ₹{app.monthly_income}</p>
            <p><b>Loan Amount:</b> ₹{app.loan_amount}</p>
          </CardContent>
        </Card>

        {/* KYC */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!kyc ? (
              <p className="text-gray-500">
                KYC verification is pending.
              </p>
            ) : (
              <>
                <p><b>Status:</b> {kyc.status}</p>
                <p><b>Name Match Score:</b> {kyc.name_match_score}</p>
                {kyc.reason && <p><b>Remarks:</b> {kyc.reason}</p>}
              </>
            )}
          </CardContent>
        </Card>

        {/* Credit */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Check</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!credit ? (
              <p className="text-gray-500">
                Credit bureau check is pending.
              </p>
            ) : (
              <>
                <p><b>Status:</b> {credit.status}</p>
                <p><b>Credit Score:</b> {credit.credit_score}</p>
                <p><b>Active Loans:</b> {credit.active_loans}</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Final Decision */}
        <Card>
          <CardHeader>
            <CardTitle>Final Decision</CardTitle>
          </CardHeader>
          <CardContent>
            {app.status === "ELIGIBLE" && (
              <p className="text-green-600 font-semibold">
                🎉 Congratulations! You are eligible for this loan.
              </p>
            )}

            {app.status === "NOT_ELIGIBLE" && (
              <p className="text-red-600 font-semibold">
                ❌ Unfortunately, you are not eligible at this time.
              </p>
            )}

            {!["ELIGIBLE", "NOT_ELIGIBLE"].includes(app.status) && (
              <p className="text-yellow-600">
                ⏳ Your application is under review. Please check back later.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
