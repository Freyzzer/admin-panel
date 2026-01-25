import { cookies } from "next/headers";
import  prisma  from "./prisma";

export async function getCurrentUser() {
  const session = (await cookies()).get("auth-token")?.value;
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session },
    select: {
      id: true,
      role: true,
      companyId: true,
      company: {
        select: { slug: true },
      },
    },
  });
}
