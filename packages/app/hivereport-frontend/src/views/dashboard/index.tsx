import React, { useEffect, useState } from 'react';
import { Add, Fullscreen } from '@mui/icons-material'
import { IconButton, Box, Divider, Typography } from '@mui/material'
import { GraphGrid } from '@hexhive/ui'
import { SelectReportModal } from '../../components/modals/select-report';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { DashboardHeader } from './header';
import { DashboardModal } from '../../components/modals/dashboard';
import { ReportCard } from '../../components/report-card';
import { EstimateReport } from '../../reports/estimates';
import { WorkInProgressReport } from '../../reports/work-in-progress';
import { useNavigate } from 'react-router-dom';
import { ReportLayout } from '../../reports';

export const Dashboard = (props) => {

    const [ selectReportOpen, openSelectReport ] = useState(false);
    const [ createOpen, openCreate ] = useState(false);

    const [ activeDashboard, setActiveDashboard ] = useState<any>();

    const [ activeLayout, setActiveLayout ] = useState<any[]>([])

    const navigate = useNavigate()


    // const { data } = useQuery(gql`
    //     query GetDashboard {
    //         reports {
    //             id
    //             name
    //         }
    //         reportDashboards {
    //             id
    //             name

    //             reports {
    //                 id
    //                 x
    //                 y
    //                 width
    //                 height

    //                 report {
    //                     name
    //                     type
    //                 }
    //             }
    //         }
    //     }
    // `)

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

    // const dashboards = data?.reportDashboards || [];

    // const reports = data?.reports || []


    // useEffect(() => {
    //     const layout = dashboards?.find((a) => a.id == activeDashboard?.id)?.reports || []
    //     setActiveLayout(layout?.map((x) => ({...x, w: x.width, h: x.height})))
    // }, [activeDashboard?.id])

    console.log({activeLayout})

    return (
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            {/* <SelectReportModal 
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
                /> */}
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
                views={[]}
                onViewChange={(view) => setActiveDashboard(view)}
                onAdd={() => openSelectReport(true)}
                onCreateView={() => openCreate(true)}
                />
            <Divider />

            <Box sx={{flex: 1, display: 'flex', overflow: 'auto'}}>
                <GraphGrid 
                    noWrap
                    editable={false}
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
                    layout={ReportLayout.map((x) => ({...x, static: true})) || []}>
                    {(item) => (
                        <Box sx={{display: 'flex', borderRadius: '6px', bgcolor: 'secondary.main', flex: 1, flexDirection: 'column'}}>
                            <Box sx={{padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Typography>{item.label}</Typography>
                                <IconButton 
                                    onClick={() => navigate(`/view/${item.id}`)}
                                    sx={{color: 'white'}} size="small">
                                    <Fullscreen fontSize="inherit" />
                                </IconButton>
                            </Box>
                            {item.element}
                        </Box>
                        // <ReportCard {...item.report} />
                    )}
                </GraphGrid>
            </Box>
           
        </Box>
    )
}