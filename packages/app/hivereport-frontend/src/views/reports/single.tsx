import { gql, useQuery } from "@apollo/client"
import { Box, Text } from "grommet"
import { useParams } from "react-router-dom"
import { useReportContext } from "../../context"
import { TreeView, TreeItem } from '@mui/lab'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { CustomTreeItem } from "../../components/tree-menu/item"
import { TreeMenu } from "../../components/tree-menu"
import { useState } from "react"
export const ReportSingleView = (props) => {

    const [ selectedSchema, setSelectedSchema ] = useState<any[]>([])

    const { id } = useParams()

    const { data } = useQuery(gql`
        query GetReport($id: ID!) {
            reports(where: {id: $id}){
                id
                name
                type
            }
        }
    `, {
        variables: {
            id
        }
    })

    const report = data?.reports?.[0];

    const { gatewaySchema } = useReportContext()

    const generateSchema = () => {
        console.log({selectedSchema})

        const schemaObj = selectedSchema.map((x) => x.split('.')).reduce((prev, curr) => {
            let base = curr[0];
            let field = curr?.[1];
            
            let update : any = Object.assign({}, prev)

            if(base && field){
                update[base] = {
                    ...update[base],
                    [field]: true
                }
            }else if(base && !field){
                update[base] = {
                    ...update[base]
                }
            }

            return {
                // ...prev,
                ...update
            }
        }, {})

        let schema = ``;

        for(var k in schemaObj){
            let fields = Object.keys(schemaObj[k])

            console.log({fields});

            if(fields.length == 0){
                schema += `${k} {\n}\n`
            }else{
                const fieldQuery = fields.map((field) => `  ${field}`).join(`\n`)
                schema += `${k} {\n${fieldQuery} \n}\n`
            }
        }

        return `query ${report?.name?.replace(' ', '')} {\n${schema}\n}`;
    }

    return (
        <Box
            elevation="small"
            round="xsmall" 
            overflow="hidden" 
            flex>
            <Box pad="xsmall" background="accent-2" direction="row">
                <Text>{report?.name}</Text>
            </Box>
            <Box direction='row' flex>
                <Box elevation="small" overflow={'auto'}>
                    <TreeMenu 
                        gatewaySchema={gatewaySchema}
                        selected={selectedSchema}
                        onSelect={(node, checked) => {
                            if(checked){
                                setSelectedSchema([...new Set([...selectedSchema, node])])
                            }else{
                                setSelectedSchema(selectedSchema.filter((a) => a.id != node))
                            }
                        }}
                        />
                    {/* <TreeView
                         sx={{ flex: 1, userSelect: 'none', maxWidth: `100%` }}
                         defaultCollapseIcon={<ExpandMore />}
                         defaultExpandIcon={<ChevronRight />}
                        >
                        {gatewaySchema?.map((query) => (
                            <CustomTreeItem 
                                nodeId={query.key} label={query.key} >
                                {query.returnType?.fields?.map((field) => (
                                    <CustomTreeItem
                                        nodeId={`${query.key}.${field.name}`} 
                                        label={field.name} />
                                ))}
                            </CustomTreeItem>
                        ))}
                    </TreeView> */}
                </Box>
                <Box flex>
                    <textarea 
                        rows={30}
                        value={generateSchema()} />
                </Box>
            </Box>
        </Box>
    )
}