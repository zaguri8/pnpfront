import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useFirebase } from "../../context/Firebase";
import SectionTitle from '../SectionTitle'
import { InnerPageHolder } from '../utilities/Holders'
import { useLocation } from 'react-router'
import { Unsubscribe } from 'firebase/database'
import { PNPPage } from '../../cookies/types'
import { PageHolder } from "../utilities/Holders";
export default function Charts() {


    const { firebase } = useFirebase()

    const location = useLocation()
    const [chartData, setChartData] = useState<any[]>()

    useEffect(() => {
        let unsub: Unsubscribe | null = null
        const pageData = location.state
        if (pageData as { page: PNPPage }) {
            unsub = firebase.realTime.addListenerToBrowsingStat((pageData as { page: PNPPage }).page, (d) => {
                setChartData([
                    ["נכנסו ונרשמו", "נכנסו וייצאו"],
                    ["נכנסו ונרשמו", d.leaveWithAttendance],
                    ["נכנסו וייצאו", d.leaveNoAttendance]])
            })
        }
        return () => { unsub && unsub() }
    }, [])


    return <PageHolder style= {{ overflow: 'hidden' }}>
        <SectionTitle style={{}} title={'נתוני כניסה: הרשמה'} />
        <InnerPageHolder style={{ padding: '0px', background: 'rgb(32,5,20)', overflow: 'hidden' }}>

            {chartData && <Chart
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
            </Chart>}
        </InnerPageHolder>
    </PageHolder>
}