import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '@hexhive/ui';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { ReportListView } from './views/reports/list'
import { DatasourceView } from './views/datasources'
import { Dashboard } from './views/dashboard'
import { ReportSingleView } from './views/reports/single';
import { gql, useQuery } from '@apollo/client';
import { ReportProvider } from './context';
import { ReportViewer } from './views/report-viewer';

export const App = () => {

    const navigate = useNavigate();

    const menu = [
        {
            label: "Dashboard",
            path: "",
        },
        {
            label: "Reports",
            path: "reports"
        },
        {
            label: "Datasources",
            path: "data"
        }
    ]

    const { data } = useQuery(gql`
        query GetGatewayInfo {
            
	        __schema{ 
                queryType{
                    fields{
                        name
                        type {
                            name
                            kind
                            ofType {
                                kind
                                name
                                ofType {
                                    kind 
                                    name
                                    fields {
                                        name
                                    }
                                }
                                fields{
                                    name
                                }
                            }
                            fields{
                                name
                            }
                        }
                    }
                }
            }
        }
    `)

    const gatewaySchema = useMemo(() => {
        const queryFields = data?.__schema?.queryType?.fields || [];

        return queryFields?.map((query) => {
            const isList = query?.type?.kind == "LIST"
            const isNonNull = query?.type?.kind == "NON_NULL"
            const isNonNullList = isNonNull ? query?.type?.ofType?.kind == "LIST" : false


            const name =  isList ? query.type.ofType.name : (isNonNull && !isNonNullList) ? query?.type?.ofType?.name : isNonNullList ? query?.type?.ofType?.ofType?.name : query.type.name
            const fields = isList ? query.type.ofType?.fields : (isNonNull && !isNonNullList) ? query?.type?.ofType?.fields : isNonNullList ? query?.type?.ofType?.ofType?.fields : query.type.fields
               
            console.log({name, fields})

            return {
                key: query.name,
                returnType: {
                    isList,
                    name,
                    fields
                 }
            }
        })
    }, [data?.__schema])

    return (
        <ReportProvider value={{gatewaySchema}}>
        <Box sx={{display: 'flex', height: '100%', color: 'white'}}>
            <Sidebar
                onSelect={(item) => navigate(item.path)}
                menu={menu}
                />
            <Box sx={{display: 'flex', bgcolor: 'primary.dark', flex: 1}}>
                <Routes>
                    <Route path={""} element={<Outlet />}>
                        <Route path={""} element={<Dashboard />} />
                        <Route path={'view/:id'} element={<ReportViewer />} />
                        <Route path={'reports'} element={<Outlet />}>
                            <Route path={''} element={<ReportListView />} />
                            <Route path={':id/*'} element={<ReportSingleView />} />
                        </Route>
                        <Route path={'data'} element={<Outlet />}>
                            <Route path={''} element={<DatasourceView />} />
                        </Route>    
                    </Route>
                </Routes>
            </Box>
        </Box>
        </ReportProvider>
    )
}