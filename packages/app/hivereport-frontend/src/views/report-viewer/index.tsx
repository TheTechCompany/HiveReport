import { Box, Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ReportLayout } from '../../reports';

export const ReportViewer = () => {
    const { id } = useParams();
    
    const report = ReportLayout.find((a) => a.id == id);

    return (
        <Box sx={{padding: '6px', flex: 1, flexDirection: 'column', display: 'flex'}}>

            <Typography>{report?.label}</Typography>

            {report?.element}
        </Box>
    )
}