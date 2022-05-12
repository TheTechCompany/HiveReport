import React, { useState } from 'react';
import { Box ,Text, List, Button} from 'grommet';
import { ListBox } from '@hexhive/ui';
import { Add, MoreVert } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ReportModal } from '../../components/modals/report';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

export const ReportListView = (props) => {

    const navigate = useNavigate()

    const [ modalOpen, openModal ] = useState(false);

    const [ createReport ] = useMutation(gql`
        mutation CreateReport($name: String, $type: String){
            createReport(input: {name: $name, type: $type}){
                id
            }
        }
    `)
    const client = useApolloClient()

    const { data } = useQuery(gql`
        query GetReports {
            reports {
                id
                name
                type
            }
        }
    `)

    const refetch = () => {
        client.refetchQueries({include: ['GetReports']})
    }

    const reports = data?.reports || [];

    return (
        <Box flex elevation='small'>
            <ReportModal 
                open={modalOpen}
                onSubmit={(report) => {
                    createReport({variables: {name: report.name, type: report.type}}).then(() => {
                        openModal(false);
                        refetch()
                    })
                }}
                onClose={() => openModal(false)}
                />
            {/* <List data={[]} /> */}
            <ListBox 
                data={reports}
                onClickItem={(item) => {navigate(item.id)}}
                renderItem={(item) => {
                    return <Box align='center' justify='between' direction='row'>
                            <Text>{item.name} - {item.type}</Text>
                            {/* <IconButton size='small'>
                                <MoreVert fontSize='inherit' />
                            </IconButton> */}
                        </Box>
                }}
                header={(
                <Box align='center' direction='row' justify='between'>
                    <Text>Reports</Text>
                    <Button 
                        plain 
                        onClick={() => openModal(true)}
                        style={{padding: 6, borderRadius: 3}}
                        hoverIndicator
                        icon={<Add fontSize="small" />} />
                </Box>
                )} />
        </Box>

    )
}