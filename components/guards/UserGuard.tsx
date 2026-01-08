"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function UserGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userId) {
      router.replace("/login");
    }
  }, [loading, userId, router]);

  if (loading || !userId) {
    return <div className="p-6 text-gray-500">Checking login...</div>;
  }

  return <>{children}</>;
}
