import { LineGraph } from "@hexhive/ui"
import { Box, Paper, Typography } from "@mui/material"

export const WorkInProgressReport = () => {
    return (
        <Paper sx={{flex: 1, display: 'flex'}}>
            <div style={{position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)'}}>
                <Typography>Datasource not attached</Typography>
            </div>
            <LineGraph
                data={[
                    {
                        x: 0,
                        y: 1,
                    },
                    {
                        x: 2,
                        y: 3,
                    },
                    {
                        x: 4,
                        y: 1
                    }
                ]}
                xKey='x'
                yKey="y"
                    />
        </Paper>
    )
}