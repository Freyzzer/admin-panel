'use client'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default  function DashboardPage() {
  const router = useRouter();
  const {user, isAuthenticated, loading} = useAuth();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (!loading && isAuthenticated && user) {
      const param = localStorage.getItem("companySlug") || (user as any).company?.slug;
      if (param) {
        router.push(`/${param}`);
      }
    }
  }, [isAuthenticated, loading, user, router]);
  
  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p>Redirigiendo...</p>
      </div>
    </div>
  );
}
