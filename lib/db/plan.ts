'use server'
import prisma from "../prisma";
import { ClientStatus, PaymentStatus } from "@/app/generated/prisma/enums";


export const getAllPlanByCompany = async (id:string) => {
    try{
        const data = await prisma.plan.findMany({
            where: {
                companyId: id,
            },
            })
        return data;
    } catch (error) {
        console.error("Error fetching Plan:", error);
        throw error;
    }
}

export const CreatePlan = async (name:string, interval:string, price:number, companyId:string) => {
    try{
        const data = await prisma.plan.create({
            data:{
                name,
                interval,
                price,
                companyId
            }
        })
        return data;
    } catch (error) {
        console.error("Error creating Plan:", error);
        throw error;
    }
}

export const DeletePlan = async (id:string) => {
    try{
        const data = await prisma.plan.delete({
            where:{
                id
            }
        })
        return data;
    } catch (error) {
        console.error("Error deleting Plan:", error);
        throw error;
    }
}

export const UpdatePlan = async (id:string, name:string, interval:string, price:number) => {
    try{
        const data = await prisma.plan.update({
            where:{
                id
            },
            data:{
                name,
                interval,
                price
            }
        })
        return data;
    } catch (error) {
        console.error("Error updating Plan:", error);
        throw error;
    }
}