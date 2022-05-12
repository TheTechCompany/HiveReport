import { PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid'

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type Query {
            reports(where: ReportWhere): [Report]
            reportDashboards(where: ReportDashboardWhere): [ReportDashboard]
        }

        type Mutation {
            createReport(input: ReportInput): Report
            updateReport(id: ID, input: ReportInput): Report
            deleteReport(id: ID): Report

            createReportDashboard(input: ReportDashboardInput): ReportDashboard
            updateReportDashboard(id: ID, input: ReportDashboardInput): ReportDashboard
            deleteReportDashboard(id: ID): ReportDashboard

            createReportDashboardItem(input: ReportDashboardItemInput): ReportDashboardItem
            updateReportDashboardItem(id: ID, input: ReportDashboardItemInput): ReportDashboardItem
            deleteReportDashboardItem(id: ID): ReportDashboardItem

        }

        input ReportDashboardWhere {
            id: ID
        }

        input ReportDashboardInput {
            name: String

            grid: [ReportDashboardGridInput]
        }

        input ReportDashboardGridInput {
            id: ID

            x: Float
            y: Float
            width: Float
            height: Float
        }

        type ReportDashboard {
            id: ID

            name: String

            reports: [ReportDashboardItem]

            organisaton: HiveOrganisation
        }

        input ReportDashboardItemInput {
            report: String
            dashboard: String

            x: Float
            y: Float
            width: Float
            height: Float
            
        }

        type ReportDashboardItem {
            id: ID

            x: Float
            y: Float
            width: Float
            height: Float

            report: Report

            dashboard: ReportDashboard
        }

        input ReportWhere {
            id: ID
        }

        input ReportInput{
            name: String
            type: String
        }

        type Report {
            id: ID
            
            name: String
            type: String
    
            createdBy: HiveUser

            createdAt: DateTime

            organisation: HiveOrganisation
        }

       
    `;

    const resolvers = {
        Query: {
            reports: async (root: any, args: any, context: any) => {
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
            },
            reportDashboards: async (root: any, args: any, context: any) => {
                let where : any = {};
                if(args.where?.id){
                    where.id = args.where.id;
                }

                return await prisma.reportDashboard.findMany({
                    where: {
                        ...where,
                        organisation: context?.jwt?.organisation
                    },
                    include: {
                        reports: {
                            include: {
                                report: true
                            }
                        }
                    }
                })
            }
        },
        Mutation: {
            createReportDashboard: async (root: any, args: any, context: any) => {
                return await prisma.reportDashboard.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        createdBy: context?.jwt?.id,
                        organisation: context?.jwt?.organisation
                    }
                })
            },
            updateReportDashboard: async (root: any, args: any, context: any) => {

                let update : any = {};

                if(args.input.name) update.name = args.input.name;
                if(args.input.grid){
                    update.reports = {
                        update: args.input.grid?.map((grid_item: {id: string, x: number, y: number, width: number, height: number}) => ({
                            where: {id: grid_item.id},
                            data: {
                                x: grid_item.x,
                                y: grid_item.y,
                                width: grid_item.width,
                                height: grid_item.height
                            }
                        }))
                    }
                }

                return await prisma.reportDashboard.update({
                    where: {id: args.id},
                    data: {
                        ...update
                    }
                })
            },
            deleteReportDashboard: async (root: any, args: any, context: any) => {
                return await prisma.reportDashboard.delete({where: {id: args.id}})
            },
            createReportDashboardItem: async (root: any, args: any, context: any) => {
                return await prisma.reportDashboardItem.create({
                    data: {
                        id: nanoid(),
                        x: args.input.x || 0,
                        y: args.input.y || 0,
                        width: args.input.width || 3,
                        height: args.input.height || 3,
                        report: {connect: {id: args.input.report}},
                        dashboard: {connect: {id: args.input.dashboard}}
                    }
                })
            },
            updateReportDashboardItem: async (root: any, args: any, context: any) => {
                return await prisma.reportDashboardItem.update({
                    where: {id: args.id},
                    data: {
                        x: args.input.x || 0,
                        y: args.input.y || 0,
                        width: args.input.width || 3,
                        height: args.input.height || 3,
                        report: {connect: {id: args.input.report}},
                        dashboard: {connect: {id: args.input.dashboard}}
                    }
                })
            },
            deleteReportDashboardItem: async (root: any, args: any, context: any) => {
                return await prisma.reportDashboardItem.delete({where: {id: args.id}})
            },
            createReport: async (root: any, args: any, context: any) => {
                return await prisma.report.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        type: args.input.type,
                        organisation: context?.jwt?.organisation,
                        createdBy: context?.jwt?.id
                    }
                })
            },
            updateReport: async (root: any, args: any, context: any) => {
                return await prisma.report.update({
                    where: {id: args.id},
                    data: {
                        name: args.input.name,
                        type: args.input.type
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