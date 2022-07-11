import { EstimateReport } from "./estimates";
import { WorkInProgressReport } from "./work-in-progress";

export const ReportLayout = [
    {
        id: 'estimates',
        label: "Quoting Timeline",
        element: <EstimateReport />,
        x: 0,
        y: 0,
        w: 20,
        h: 12
    },
    {
        id: 'work-in-progress',
        label: "Work in Progress",
        element: <WorkInProgressReport />,
        x: 0,
        y: 12,
        w: 8,
        h: 8
    }
]
