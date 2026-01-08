import UserGuard from "@/components/guards/UserGuard";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGuard>
      {children}
    </UserGuard>
  );
}
