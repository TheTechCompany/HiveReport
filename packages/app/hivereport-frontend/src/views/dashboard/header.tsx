import { Box, Select, Text } from 'grommet';
import React from 'react';

import { Add } from '@mui/icons-material'
import { IconButton, Divider } from '@mui/material'

export const DashboardHeader = (props) => {
    return (
      <Box direction='row' justify='between' align='center'>
     
        <Select
        size="small"
        placeholder="Report Dashboard"
        plain
        labelKey={"name"}
        valueKey={{key: 'id', reduce: true}}
        value={props.view?.id}
        onChange={({ option }) => {
            if(option.id == 'create'){
                props.onCreateView?.();
            }else{
                props.onViewChange?.(option)
            }
        }}
        options={(props.views || ["Projects", "People", "Estimates"].map((x) => ({name: x}))).concat([{id: 'create', name: "Create Dashboard"}])}>
        {(datum) => (
            <Box
                background={datum.id == 'create' ? '#dfdfdf' : undefined}
                pad="xsmall"
                direction='row'
                justify={datum.id == 'create' ? 'center' : undefined}>
                <Text>{datum.name}</Text>
            </Box>
        )}
    </Select>
     
    <IconButton onClick={props.onAdd}>
                    <Add />
    </IconButton>
            
    </Box>
    )
}