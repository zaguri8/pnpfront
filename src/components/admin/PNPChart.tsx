import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useFirebase } from "../../context/Firebase";
import SectionTitle from '../SectionTitle'
import { dateStringFromDate, hyphenToMinus } from '../utilities/functions'
import { getCurrentDate } from '../../utilities'
import { InnerPageHolder } from '../utilities/Holders'
import { useLocation } from 'react-router'
import { Unsubscribe } from 'firebase/database'
import { PNPPage } from '../../cookies/types'
export default function PNPChart(props: { page: PNPPage, date: string }) {
    const { firebase } = useFirebase()
    const [chartData, setChartData] = useState<any[]>()
    useEffect(() => {
        let unsub: Unsubscribe | null = null
        if (props.page) {
            unsub = firebase.realTime.addListenerToBrowsingStat(props.page, hyphenToMinus(props.date), (d) => {
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