import React from 'react';
import { Box } from 'grommet';

import { GraphGrid } from '@hexhive/ui'

export const Dashboard = (props) => {
    return (
        <Box>
            Dashboard
            <GraphGrid 
                layout={[]}>
                {(item) => (
                    <Box>item</Box>
                )}
            </GraphGrid>
        </Box>
    )
}