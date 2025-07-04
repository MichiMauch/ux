import { redirect } from "next/navigation";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

// This would be replaced with your actual auth system
async function checkAdminAuth() {
  // For now, we'll simulate admin check
  // In production, this should check actual user roles
  return true; // Replace with actual auth logic
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdminAuth();
  
  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}