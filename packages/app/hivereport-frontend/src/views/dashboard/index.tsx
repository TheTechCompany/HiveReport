import React, { useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import { Add } from '@mui/icons-material'
import { IconButton, Divider } from '@mui/material'
import { GraphGrid } from '@hexhive/ui'
import { SelectReportModal } from '../../components/modals/select-report';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { DashboardHeader } from './header';
import { DashboardModal } from '../../components/modals/dashboard';
import { ReportCard } from '../../components/report-card';

export const Dashboard = (props) => {

    const [ selectReportOpen, openSelectReport ] = useState(false);
    const [ createOpen, openCreate ] = useState(false);

    const [ activeDashboard, setActiveDashboard ] = useState<any>();

    const [ activeLayout, setActiveLayout ] = useState<any[]>([])

    const { data } = useQuery(gql`
        query GetDashboard {
            reports {
                id
                name
            }
            reportDashboards {
                id
                name

                reports {
                    id
                    x
                    y
                    width
                    height

                    report {
                        name
                        type
                    }
                }
            }
        }
    `)

    const client = useApolloClient()

    const [ createDashboard ] = useMutation(gql`
        mutation CreateReportDashboard($name: String) {
            createReportDashboard(input: {name: $name}){
                id
            }
        }
    `)

    const [ updateDashboardGrid ] = useMutation(gql`
        mutation UpdateReportDashboard($id: ID, $grid: [ReportDashboardGridInput]) {
            updateReportDashboard(id: $id, input: {grid: $grid}){
                id
            }
        }
    `)

    const [ createDashboardItem ] = useMutation(gql`
        mutation CreateDashboardItem ($report: String, $dashboard: String){
            createReportDashboardItem(input: {report: $report, dashboard: $dashboard}){
                id
            }
        }
    `)

    const refetch = () => {
        client.refetchQueries({include: ['GetDashboard']})
    }

    const dashboards = data?.reportDashboards || [];

    const reports = data?.reports || []


    useEffect(() => {
        const layout = dashboards?.find((a) => a.id == activeDashboard?.id)?.reports || []
        setActiveLayout(layout?.map((x) => ({...x, w: x.width, h: x.height})))
    }, [activeDashboard?.id])

    console.log({activeLayout})

    return (
        <Box flex>
            <SelectReportModal 
                reports={reports}
                open={selectReportOpen}
                onSubmit={(report) => {
                    createDashboardItem({variables: {report: report, dashboard: activeDashboard.id}}).then(() => {
                        openSelectReport(false);
                        refetch();
                    })
                }}
                onClose={() => {
                    openSelectReport(false)
                }}
                />
            <DashboardModal 
                open={createOpen}
                onSubmit={(dashboard) => {
                    createDashboard({variables: {name: dashboard.name}}).then(() => {
                        openCreate(false)
                        refetch()
                    })
                }}
                onClose={() => {
                    openCreate(false)
                }}
                />
            <DashboardHeader
                view={activeDashboard}
                views={dashboards}
                onViewChange={(view) => setActiveDashboard(view)}
                onAdd={() => openSelectReport(true)}
                onCreateView={() => openCreate(true)}
                />
            <Divider />

            <Box flex overflow={'auto'}>
                <GraphGrid 
                    noWrap
                    onLayoutChange={(grid) => {

                        updateDashboardGrid({
                            variables: {
                                id: activeDashboard?.id,
                                grid: grid?.map((x) => ({
                                    id: x.i,
                                    x: x.x,
                                    y: x.y,
                                    width: x.w,
                                    height: x.h
                                }))
                            }
                        }).then(() => {
                            refetch()
                        })
                        // console.log({grid})
                        // if(grid.length > 0){
                        // //   setActiveLayout(grid)
                        // }
                    }}
                    layout={activeLayout || []}>
                    {(item) => (
                        <ReportCard {...item.report} />
                    )}
                </GraphGrid>
            </Box>
           
        </Box>
    )
}