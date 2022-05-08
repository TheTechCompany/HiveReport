import React from 'react';
import { Box } from 'grommet';
import { Sidebar } from '@hexhive/ui';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { ReportView } from './views/reports'
import { DatasourceView } from './views/datasources'
import { Dashboard } from './views/dashboard'

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
    return (
        <Box flex direction='row'>
            <Sidebar
                onSelect={(item) => navigate(item.path)}
                menu={menu}
                />
            <Box flex>
                <Routes>
                    <Route path={""} element={<Outlet />}>
                        <Route path={""} element={<Dashboard />} />
                        <Route path={'reports'} element={<Outlet />}>
                            <Route path={''} element={<ReportView />} />
                        </Route>
                        <Route path={'data'} element={<Outlet />}>
                            <Route path={''} element={<DatasourceView />} />
                        </Route>    
                    </Route>
                </Routes>
            </Box>
        </Box>
    )
}