"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, token, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/user");
      }
    }
  }, [loading, token, isAdmin, router]);

  if (loading || !token || !isAdmin) {
    return (
      <div className="p-8 text-gray-500">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}
