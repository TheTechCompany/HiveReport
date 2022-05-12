import { BaseModal, FormControl, FormInput } from "@hexhive/ui";
import { useState } from "react";

export const DashboardModal = (props) => {
    // const REPORT_OPTIONS = [
    //     { label: "Timeline", value: "timeline" },
    //     { label: "Line Chart", value: "lineChart" },
    //     { label: "Bar Chart", value: "barChart" },
    //     { label: "Pie Chart", value: "pieChart" },
    // ]

    const [ dashboard, setDashboard ] = useState<{
        name?: string,
        // type?: string,
    }>({})

    const onSubmit = () => {
        props.onSubmit?.(dashboard)
    }

    return (
        <BaseModal
            open={props.open}
            onClose={props.onClose}
            onSubmit={onSubmit}
            title="Create Dashboard">

            <FormInput 
                placeholder="Name"
                value={dashboard.name}
                onChange={(value) => setDashboard({...dashboard, name: value})}
                />

            
        </BaseModal>
    )
}