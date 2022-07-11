import { Box } from 'grommet';
import React from 'react'

import { REPORT_TYPES } from './reports'

export interface ReportCardProps {
    type?: string;
}

export const ReportCard : React.FC<ReportCardProps> = (props) => {
    const Element = REPORT_TYPES?.find((a) => a.value == props.type)?.component || Box
    return <Box >
        WIidth
    </Box>
}