import { BaseModal, FormControl, FormInput } from "@hexhive/ui";
import { useState } from "react";
import { REPORT_TYPES } from "../../report-card/reports";

export const ReportModal = (props) => {
  
    const [ report, setReport ] = useState<{
        name?: string,
        type?: string,
    }>({})

    const onSubmit = () => {
        props.onSubmit?.(report)
    }

    return (
        <BaseModal
            open={props.open}
            onClose={props.onClose}
            onSubmit={onSubmit}
            title="Create Report">

            <FormInput 
                placeholder="Name"
                value={report.name}
                onChange={(value) => setReport({...report, name: value})}
                />
            <FormControl 
                labelKey="label"
                valueKey="value"
                value={report.type}
                onChange={(value) => setReport({...report, type: value})}
                placeholder="Report Type"
                options={REPORT_TYPES}
                />
            
        </BaseModal>
    )
}