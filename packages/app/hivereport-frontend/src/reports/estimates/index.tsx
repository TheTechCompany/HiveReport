import { gql, useQuery } from "@apollo/client";
import { Timeline, ColorDot } from "@hexhive/ui";
import { Paper, Box, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { stringToColor } from '@hexhive/utils';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const HourTypes: any = {
    Welder: stringToColor('Welder'), // "#7fc721",
    TA: "#a3439b",
    Fabricator: "#43a3a3",
    "Skilled Labourer": "#734ab5",
    "Civil Subcontractor": "#c9900a"
}

const StatusTypes : any = {
    Won: 'green',
    Lost: 'red',
    "Customer has quote": '#8fb7cf',
    "Open": '#EEBC1D' 
}

export const EstimateReport = () => {

    const [ timeline, setTimeline ] = useState([]);

    const [horizon, setHorizon] = useState<{ start: Date, end: Date } | undefined>()

    const { data } = useQuery(gql`
        query GetEstimates($start: DateTime, $end: DateTime) {
            estimates (where: {date_GTE: $start, date_LTE: $end}) {
                id
                status
                price
                date
            }
        }
    `, {
        variables: {
            start: horizon?.start,
            end: horizon?.end
        }
    })

    const quotes = data?.estimates || [];

    const filter = [];



    const getColorBars = (plan: { hatched?: boolean, items?: any[] }) => {
        let total = plan.items?.reduce((previous: any, current: any) => previous += current.quantity, 0)

        let sum = plan.items?.reduce((previous, current) => {

            if (!previous[current.item]) previous[current.item] = 0
            previous[current.item] += current.quantity
            return previous
        }, {})

        let gradient = Object.keys(sum).map((key) => {
            return {
                color: HourTypes[key],
                percent: sum[key] / total
            }
        })

        return generateStripes(gradient, plan.hatched);
    }


    const generateStripes = (colors: { color: string, percent: number }[], hatched?: boolean) => {
        let c = colors.sort((a, b) => b.percent - a.percent)

        if (c.length <= 0) return 'gray' //stringToColor(`${props.item?.name}`)

        let gradient: any[] = [];
        let current_stop = 0;

        c.forEach((x, ix) => {
            let start_pos = current_stop * 100
            let end_pos = start_pos + (x.percent * 100)
            gradient.push(`${x.color} ${start_pos}%`) //First stop

            if (hatched) {
                let diff = (end_pos - start_pos) / 10

                for (var i = 0; i < diff; i++) {
                    let hatch_start = start_pos + (i * 10);
                    let hatch_end = hatch_start + 10;

                    // gradient.push(`${i % 2 ? 'gray' : x.color} ${hatch_start}%`)
                    // gradient.push(`${i % 2 ? 'gray' : x.color} ${hatch_end}%`)
                }

            }

            gradient.push(`${x.color} ${end_pos}%`) //End stop
            current_stop += x.percent;
        })

        let hatched_output = `
            repeating-linear-gradient(45deg, #ffffff42, #ffffff42 10px, transparent 10px, transparent 20px)
        `
        let output = `linear-gradient(${hatched ? '45deg' : '90deg'}, ${gradient.join(', ')})`

        if (hatched) {
            return `${hatched_output}, ${output}`
        } else {
            return output;
        }
        console.log(output)
    }

    const getWonLost = (total: number, item: any, default_color: string) => {
        let gradient = [];

        for(var k in item){
            gradient.push({color: StatusTypes[k], percent: item[k] / total})
        }
        

        return generateStripes(gradient, false)
    }

    const parseEstimates = () => {
        let _weeks: any = {};

        console.log({quotes: quotes.filter((a) => true)})
        const weeks = quotes?.filter((a: { date: Date, status: string; }) => {
            if(!a.date) return false; //a.date != null;
            if(filter.length > 0) return filter.indexOf(a.status) > -1
            return true;
        }).reduce((previous: { [x: string]: { [x: string]: any; }; }, current: { date: string; price: any; status: string | number; }) => {
            let date = new Date(current.date);
            let start = moment(date).format('W/yyyy');

            // date.setHours(0);
            // date.setMinutes(0);
            // date.setSeconds(0);

            // let start = new Date(current.date)?.getTime();

            if (!previous[start]) previous[start] = {
                value: 0
            };

            previous[start].value += current.price

            if(!previous[start][current.status]) previous[start][current.status] = 0;
            previous[start][current.status] += current.price
            
            return previous
        }, _weeks)

        console.log({weeks})

        setTimeline(Object.keys(weeks).sort((a, b) => a == b ? 0 : a > b ? -1 : 1).map((start, ix) => {
            let value = weeks[start].value;

            let date = new Date(moment(start, 'W/yyyy').toDate());

            delete weeks[start].value;
            return {
                id: `${start}`,
                name: `Week ${moment(date).format("W/yyyy")}`,
                color: getWonLost(value, weeks[start], stringToColor(moment(date).format("DD/mm/yyyy"))),
                start: date,
                end: new Date(moment(date).add(7, 'days').valueOf()),
                showLabel: formatter.format(value),
                hoverInfo: (
                    <Box sx={{display: 'flex', flexDirection: "column"}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            {/* <Text weight="bold">{capacity_plan?.project?.name?.substring(0, 15)}</Text> */}
                            <Typography>
                                {formatter.format(value)}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                            {Object.keys(weeks[start]).map((x) => {
                                let item = weeks[start][x]
                                return (
                                <Box sx={{alignItems:"center", display: 'flex', flexDirection:"row", justifyContent:"between"}}>
                                        <Box sx={{display: 'flex', alignItems: 'center'}} >
                                            <ColorDot color={StatusTypes[x || '']} size={10}/>
                                            <Typography>{((item / value )* 100).toFixed(2)}% - {x}</Typography>
                                        </Box>
                                    <Typography sx={{marginLeft: '3px'}}>{formatter.format(item)}</Typography>
                                </Box>
                                )
                            }
                            )}
                        </Box>
                 
                    </Box>
                ),
            }
        }))
    }

    useEffect(()=> {
        parseEstimates()
    }, [JSON.stringify(quotes)])

    return (
        <Paper sx={{flex: 1, display: 'flex'}}>
            <Timeline
                onHorizonChange={(start, end) => setHorizon({start, end})}
                data={timeline || []}
                />
        </Paper>
    )
}