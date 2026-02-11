'use server'
import { ClientStatus } from "@/app/generated/prisma/enums";
import prisma from "../prisma";

export const UpdateClientById = async (id:string, data:{name?:string, email?:string, planId?:string, status?:ClientStatus}) => {
    try{
        const updatedClient = await prisma.client.update({
            where: {
                id: id
            },
            data: data
        });
        return updatedClient;
    } catch (error) {
        console.error("Error updating client by ID:", error);
        throw error;
    }
}