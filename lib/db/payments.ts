'use server'
import prisma from "../prisma";
import { ClientStatus } from "@/app/generated/prisma/enums";

export const getAllPaymentsByCompany = async (id:string) => {
    try{
        const data = await prisma.payment.findMany({
            where: {
                companyId: id
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
}
