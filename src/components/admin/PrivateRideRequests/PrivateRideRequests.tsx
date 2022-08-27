import { CSSProperties, useEffect, useState } from "react";
import { PRIMARY_PINK, SECONDARY_WHITE } from "../../../settings/colors";
import { PNPExplicitPrivateRide, PNPPrivateRide } from "../../../store/external/types";
import { Hooks } from "../../generics/types";
import { withHookGroup } from "../../generics/withHooks";
import SectionTitle from "../../other/SectionTitle";
import { PageHolder } from "../../utilityComponents/Holders";



function PrivateRideRequests(props: Hooks) {

    const [requests, setRequests] = useState<PNPExplicitPrivateRide[]>([])
    useEffect(() => {
        props.headerExt.hideHeader()
        return () => props.headerExt.showHeader()
    }, [])

    useEffect(() => {
        let unsub = props.firebase.firebase.realTime.getAllPrivateRideExplicit(setRequests, (err) => {
            alert(err)
        })
        return () => unsub()
    }, [])


    const tableheaderrow = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    } as CSSProperties
    const tablerow = {
        display: 'flex',
        color: PRIMARY_PINK,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    } as CSSProperties
    const tableHeader = {
        padding: '4px',
        fontSize: '12px',
        width: '60px',
        flexGrow: 1
    } as CSSProperties
    const tableLabel = {
        padding: '4px',
        flexGrow: 1,
        textAlign: 'center',
        width: '60px',
        fontSize: '10px'
    } as CSSProperties
    return <PageHolder style={{ overflowX: 'hidden' }}>
        <SectionTitle title="הזמנות נסיעות" style={{ marginBottom: '16px' }} />
        {requests && <table style={{ maxWidth: '400px', direction: 'rtl', overflowX: 'hidden' }}>
            <thead style={{
                color: SECONDARY_WHITE
            }}>
                <tr style={tableheaderrow}>
                    <th style={tableHeader}>שם</th>
                    <th style={tableHeader}>טלפון</th>
                    <th style={tableHeader}>יציאה</th>
                    <th style={tableHeader}>יעד</th>
                    <th style={tableHeader}>תאריך</th>
                </tr>
            </thead>

            <tbody>
                {requests.map(request => <tr
                    style={tablerow}
                    key={request.rideId}>
                    <td style={tableLabel}>{request.customerName}</td>
                    <td style={tableLabel}>{request.customerPhone}</td>
                    <td style={tableLabel}>{request.rideStartingPoint}</td>
                    <td style={tableLabel}>{request.backPoint}</td>
                    <td style={tableLabel}>{request.date}</td>
                </tr>)}
            </tbody>
        </table>}
    </PageHolder>
}

export default withHookGroup(PrivateRideRequests, ['firebase', 'loading', 'nav', 'headerExt'])