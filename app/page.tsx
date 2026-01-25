'use client'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default  function DashboardPage() {
  const router = useRouter();
  const {user, isAuthenticated} = useAuth();
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }
  const param = localStorage.getItem("companySlug");
  router.push(`/${param}`);
  
  return (
    <h1>
      BIENVENIDOS
    </h1>
  );
}
