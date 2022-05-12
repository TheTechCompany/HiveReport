import React, { useContext } from 'react'

export const ReportContext = React.createContext<{
    gatewaySchema?: any[]
}>({})

export const ReportProvider = ReportContext.Provider;

export const useReportContext = () => useContext(ReportContext)