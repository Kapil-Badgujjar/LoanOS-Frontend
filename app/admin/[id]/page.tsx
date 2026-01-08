"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function AdminApplicationView() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await api.get(`/admin/applications/${id}`);
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  /* -------- Admin actions -------- */
  const runKyc = async () => {
    try {
      setError("");
      setLoadingAction(true);
      await api.post(`/kyc/${id}`);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to run KYC");
    } finally {
      setLoadingAction(false);
    }
  };

  const runCredit = async () => {
    try {
      setError("");
      setLoadingAction(true);
      await api.post(`/credit/${id}`);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to run credit check");
    } finally {
      setLoadingAction(false);
    }
  };

  const runEligibility = async () => {
    try {
      setError("");
      setLoadingAction(true);
      await api.post(`/eligibility/${id}`);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to run eligibility check");
    } finally {
      setLoadingAction(false);
    }
  };


  if (!data) {
    return <div className="p-8 text-gray-500">Loading application...</div>;
  }

  const app = data.application;
  const canRunKyc = app.status === "DRAFT";
  const canRunCredit = app.status === "KYC_COMPLETED";
  const canRunEligibility = app.status === "CREDIT_CHECK_COMPLETED";
  const kyc = data.kyc_result;
  const credit = data.credit_result;


  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Application #{id}
          </h1>
          <p className="text-gray-600 mt-1">
            Admin workflow & verification controls
          </p>
        </div>

        <Badge className={statusColor(app.status)}>
          {app.status}
        </Badge>
      </div>

      {error && (
        <p className="text-red-600 font-medium">
          {error}
        </p>
      )}

      {/* Applicant Info */}
      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
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

      {/* Workflow Timeline + Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {[
              "DRAFT",
              "KYC_PENDING",
              "KYC_COMPLETED",
              "CREDIT_CHECK_PENDING",
              "CREDIT_CHECK_COMPLETED",
              "ELIGIBLE",
              "NOT_ELIGIBLE",
            ].map((step) => (
              <Badge
                key={step}
                variant={app.status === step ? "default" : "outline"}
              >
                {step}
              </Badge>
            ))}
          </div>

          {/* Admin buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={runKyc}
              disabled={!canRunKyc || loadingAction}
            >
              {loadingAction && canRunKyc
                ? "Running KYC..."
                : "Run KYC"}
            </Button>

            <Button
              onClick={runCredit}
              disabled={!canRunCredit || loadingAction}
            >
              {loadingAction && canRunCredit
                ? "Running Credit Check..."
                : "Run Credit Check"}
            </Button>

            <Button
              onClick={runEligibility}
              disabled={!canRunEligibility || loadingAction}
            >
              {loadingAction && canRunEligibility
                ? "Evaluating Eligibility..."
                : "Run Eligibility"}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* KYC Result */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {kyc ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <p><b>Status:</b> {kyc.status}</p>
              <p><b>Name Match Score:</b> {kyc.name_match_score}</p>
              {kyc.reason && <p><b>Reason:</b> {kyc.reason}</p>}
            </div>
          ) : (
            <p className="text-gray-500">KYC not performed yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Credit Bureau Result */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Bureau Check</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {credit ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <p><b>Status:</b> {credit.status}</p>
              <p><b>Credit Score:</b> {credit.credit_score}</p>
              <p><b>Active Loans:</b> {credit.active_loans}</p>
            </div>
          ) : (
            <p className="text-gray-500">Credit check not performed yet.</p>
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
              ✅ Applicant is eligible for the loan.
            </p>
          )}

          {app.status === "NOT_ELIGIBLE" && (
            <p className="text-red-600 font-semibold">
              ❌ Applicant is not eligible for the loan.
            </p>
          )}

          {!["ELIGIBLE", "NOT_ELIGIBLE"].includes(app.status) && (
            <p className="text-yellow-600">
              ⏳ Application is still under processing.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
