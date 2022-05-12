import { gql, useQuery } from "@apollo/client"
import { Box, Button, Text } from "grommet"
import { matchPath, Outlet, Route, Routes, useMatch, useNavigate, useParams, useResolvedPath } from "react-router-dom"
import { useReportContext } from "../../context"
import { TreeView, TreeItem } from '@mui/lab'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { CustomTreeItem } from "../../components/tree-menu/item"
import { TreeMenu } from "../../components/tree-menu"
import { useState } from "react"
import { CodeEditor } from "@hexhive/ui"
import { ReportCard } from "../../components/report-card"
export const ReportSingleView = (props) => {

    const navigate = useNavigate();

    const TABS = [
        {
            path: '',
            label: "Query",
        },
        {
            path: 'function',
            label: "Function"
        },
        {
            path: "preview",
            label: "Preview"
        }
    ].map((x) => ({
        ...x,
        active: useMatch(useResolvedPath(x.path).pathname) != null
    }))
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



const QueryBuilder = () => {
    return (
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
    )
}

const Preview = () => {
    return (
        <Box flex pad="xsmall">
            <ReportCard type={report?.type} />
        </Box>
    )
}
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
    
    const FunctionBuilder = () => {
        return (
            <Box flex>
                <CodeEditor 
                    
                    value={""} />
            </Box>
        )
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
            <Box gap="xsmall" pad="xsmall" direction='row' align='center' background={'accent-1'}>
                {TABS.map((tab) => (
                    <Button 
                        active={tab.active}
                        onClick={() => navigate(tab.path)}
                        size="small" 
                        label={tab.label} 
                        hoverIndicator 
                        plain 
                        style={{padding: 3, borderRadius: 3}} />
                ))}
            </Box>
            <Box flex>
                <Routes>
                    <Route path={''} element={<Outlet />}>
                        <Route path={''} element={<QueryBuilder />} />
                        <Route path={'function'} element={<FunctionBuilder />} />
                        <Route path={'preview'} element={<Preview />} />

                    </Route>
                </Routes>
            </Box>
        </Box>
    )
}
