import { BaseModal, FormControl } from '@hexhive/ui';
import React, { useState } from 'react';

export const SelectReportModal = (props) => {

    const [selected, setSelected] = useState()

    const onSubmit = () => {
        props.onSubmit?.(selected)
    }

    return (
        <BaseModal
            open={props.open}
            onClose={props.onClose}
            onSubmit={onSubmit}
            title="Select Report"
            >

            <FormControl
                placeholder='Report'
                value={selected}
                onChange={(value) => setSelected(value)}
                options={props.reports || []}
                labelKey="name"
                valueKey='id' />
        </BaseModal>
    )
}