import { LineGraph } from '@hexhive/ui';
import { Box, Text } from 'grommet';
import React from 'react';

export const Linechart = (props) => {
    return (
        <Box 
            round="xsmall"
            flex elevation='small'>
            <Text>{props?.name}</Text>
            <LineGraph />
        </Box>
    )
}