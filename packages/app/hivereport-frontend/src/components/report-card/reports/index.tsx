import { Linechart } from './Linechart';
import { TimelineCard } from './Timeline';

export * from './Linechart';

export const REPORT_TYPES =  [
    { 
        label: "Timeline",
        value: "timeline",
        component: TimelineCard
    },
    { 
        label: "Line Chart", 
        value: "lineChart",
        component: Linechart
    },
    { label: "Bar Chart", value: "barChart" },
    { label: "Pie Chart", value: "pieChart" },
]
