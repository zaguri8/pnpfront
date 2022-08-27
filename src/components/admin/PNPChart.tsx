import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { hyphenToMinus } from '../utilityComponents/functions'
import { Unsubscribe } from 'firebase/database'
import { PNPPage } from '../../cookies/types'
import { Hooks } from "../generics/types";
import { withHook } from "../generics/withHooks";
type PNPChartProps = { page: PNPPage, date: string }
function PNPChart(props: PNPChartProps & Hooks) {
    const [chartData, setChartData] = useState<any[]>()
    useEffect(() => {
        let unsub: Unsubscribe | null = null
        if (props.page) {
            unsub = props.firebase.firebase.realTime.addListenerToBrowsingStat(props.page, hyphenToMinus(props.date), (d) => {
                setChartData([
                    ["נכנסו ונרשמו", "נכנסו וייצאו"],
                    ["נכנסו ונרשמו", d.leaveWithAttendance],
                    ["נכנסו וייצאו", d.leaveNoAttendance]])
            })
        }
        return () => { unsub && unsub() }
    }, [props.date])

    return chartData ? <Chart
        chartType="PieChart"
        data={chartData}
        style={{ overflow: 'hidden' }}
        options={{
            titleTextStyle: { color: 'white', textAlign: 'center' },
            backgroundColor: 'none',
            legendTextStyle: { color: '#FFF' },
            enableInteractivity: true
        }}
    >
    </Chart> : null
}
export default withHook<PNPChartProps>(PNPChart, 'firebase')