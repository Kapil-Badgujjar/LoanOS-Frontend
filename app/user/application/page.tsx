"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Apply() {
  const router = useRouter();
  const { userId, isAdmin, loading } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    pan: "",
    dob: "",
    employment_type: "Salaried",
    monthly_income: "",
    loan_amount: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- Route protection ---------------- */
  useEffect(() => {
    if (loading) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    if (isAdmin) {
      router.push("/admin");
    }
  }, [loading, userId, isAdmin, router]);

  /* ---------------- Submit handler ---------------- */
  const submit = async () => {
    setError("");

    // basic frontend validation
    if (
      !form.full_name ||
      !form.mobile ||
      !form.pan ||
      !form.dob ||
      !form.monthly_income ||
      !form.loan_amount
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/applications", {
        ...form,
        monthly_income: Number(form.monthly_income),
        loan_amount: Number(form.loan_amount),
      });

      router.push("/user");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            New Loan Application
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />

          <Input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <Input
            placeholder="PAN Number"
            value={form.pan}
            onChange={(e) =>
              setForm({ ...form, pan: e.target.value.toUpperCase() })
            }
          />

          <Input
            type="date"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={(e) =>
              setForm({ ...form, dob: e.target.value })
            }
          />

          <select
            className="w-full border rounded-md p-2 bg-white"
            value={form.employment_type}
            onChange={(e) =>
              setForm({ ...form, employment_type: e.target.value })
            }
          >
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
          </select>

          <Input
            type="number"
            placeholder="Monthly Income (₹)"
            value={form.monthly_income}
            onChange={(e) =>
              setForm({ ...form, monthly_income: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Loan Amount (₹)"
            value={form.loan_amount}
            onChange={(e) =>
              setForm({ ...form, loan_amount: e.target.value })
            }
          />

          <Button
            className="w-full"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
