import { PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid'

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type Query {
            reports(where: ReportWhere): [Report]
        }

        type Mutation {
            createReport(input: ReportInput): Report
            updateReport(id: ID, input: ReportInput): Report
            deleteReport(id: ID): Report
        }

        input ReportWhere {
            id: ID
        }

        input ReportInput{
            name: String
        }

        type Report {
            id: ID
            name: String

    
            createdAt: DateTime
        }

       
    `;

    const resolvers = {
        Query: {
            reports:async (root: any, args: any, context: any) => {
                let where : any = {};
                if(args.where?.id){
                    where.id = args.where.id;
                }
                return await prisma.report.findMany({
                    where: {
                        ...where,
                        organisation: context?.jwt?.organisation
                    }
                })
            }
        },
        Mutation: {
            createReport:async (root: any, args: any, context: any) => {
                return await prisma.report.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        organisation: context?.jwt?.organisation
                    }
                })
            },
            updateReport: async (root: any, args: any, context: any) => {
                return await prisma.report.update({
                    where: {id: args.id},
                    data: {
                        name: args.input.name
                    }
                })
            },
            deleteReport: async (root: any, args: any, context: any) => {
                return await prisma.report.delete({where: {id: args.id}})
            } 
        }
    };

    return {
        typeDefs,
        resolvers
    }
}