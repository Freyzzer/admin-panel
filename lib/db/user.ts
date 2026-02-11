'use server'
import prisma from "../prisma";
import { ClientStatus } from "@/app/generated/prisma/enums";

export const getClientById = async (id:string) => {
    try{
        const data = await prisma.client.findUnique({
            where: {
                id: id
            },
            include: {
                plan: true,
                company: true
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching client by ID:", error);
        throw error;
    }
}


export const getAllClientsByCompany = async (id:string) => {
    try{
        const data = await prisma.client.findMany({
            where: {
                companyId: id
            },
            include: {
                plan: true,
                company: true
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
}

export const getClientsActiveByCompany = async (id:string) => {
    try{
        const data = await prisma.client.findMany({
            where: {
                companyId: id,
                status: ClientStatus.ACTIVE
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching active clients:", error);
        throw error;
    }
}

export const getClientsPendingByCompany = async (id:string) => {
    try{
        const data = await prisma.client.findMany({
            where: {
                companyId: id,
                status: ClientStatus.PENDING
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching pending clients:", error);
        throw error;
    }
}

export const getClientsWithPendingPayments = async (companyId: string) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const clientsWithPendingPayments = await prisma.client.findMany({
            where: {
                companyId: companyId,
                status: ClientStatus.ACTIVE,
                OR: [
                    { payments: { none: {} } }, // Clientes sin pagos
                    { 
                        payments: {
                            some: {
                                paidAt: {
                                    lt: thirtyDaysAgo
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                plan: true,
                payments: {
                    where: {
                        status: "PAID"
                    },
                    orderBy: {
                        paidAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        return clientsWithPendingPayments;
    } catch (error) {
        console.error("Error fetching clients with pending payments:", error);
        throw error;
    }
}