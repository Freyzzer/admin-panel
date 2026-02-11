'use server'
import prisma from "../prisma";
import { ClientStatus, PaymentStatus } from "@/app/generated/prisma/enums";

export const getAllPaymentsByCompany = async (id:string) => {
    try{
        const data = await prisma.payment.findMany({
            where: {
                companyId: id,
            },
            include: {
                client: {
                include: {
                    plan: true,
                    company: true,
                },
                },
            },
            })
        return data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
}

export const getMonthlyRevenue = async (id:string) =>{
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    try{
        const data = await prisma.payment.findMany({
          where: {
            status: "PAID",
            paidAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        });

        return data;
    }catch(e){
        console.error('Error fetching Metrics MonthlytRevenue', e)
        throw e
    }
} 

export const getMonthly = async (id:string) => {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 5);
    fromDate.setDate(1);

    try{

        const payments = await prisma.payment.findMany({
          where: {
            companyId:id,
            status: PaymentStatus.PAID,
          },
          select: {
            amount: true,
            paidAt: true
          },
          orderBy: {
            paidAt: "asc"
          }
        });

        return payments
    }catch(e){
        console.error('fallo', e)
    }
}

export const createPayment = async (clientId: string, companyId: string, method: "CASH" | "TRANSFER" | "CARD" | "NEQUI" | "DAVIPLATA") => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: { plan: true }
        });

        if (!client || !client.plan) {
            throw new Error('Client or plan not found');
        }

        const payment = await prisma.payment.create({
            data: {
                clientId: clientId,
                companyId: companyId,
                amount: client.plan.price,
                method: method,
                status: PaymentStatus.PAID,
                paidAt: new Date()
            },
            include: {
                client: {
                    include: {
                        plan: true,
                        company: true
                    }
                }
            }
        });

        return payment;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
}
