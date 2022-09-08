import { CSSProperties, useEffect, useState } from "react";
import { IUserContext } from "../../../context/Firebase";
import { IBackgroundExtension, IHeaderBackgroundExtension } from "../../../context/HeaderContext";
import { ILoadingContext, useLoading } from "../../../context/Loading";
import { Hooks, ServerResponse } from "../../generics/types";
import { withHookGroup } from "../../generics/withHooks";
import SimpleForm from "../../simpleForm/SimpleForm";
import { PageHolder } from "../../utilityComponents/Holders";
import { SimpleFormField } from '../../simpleForm/simpleform.types'
import { PRIMARY_GRADIENT } from "../../other/Barcode";
import { PRIMARY_BLACK, PRIMARY_ORANGE, PRIMARY_PINK, PRIMARY_WHITE, SECONDARY_WHITE } from "../../../settings/colors";
import { blue, blueGrey, green, lightBlue, pink, red } from "@mui/material/colors";
import { boxShadow } from "../../../settings/styles";
import Spacer from "../../utilityComponents/Spacer";
import { PNPPublicRide, PNPUser } from "../../../store/external/types";
import ServerRequest from "../../../network/serverRequest";
import { Navigate, useLocation, useParams } from "react-router";
function SMS(props: Partial<Hooks>) {
    type SMSState = { client: any, ride: any } | undefined
    const location = useLocation()
    const [sacState, setSacState] = useState<SMSState>(location.state as SMSState)

    let inputStyle = {
        padding: '8px',
        width: 'fit-content',
        direction: 'rtl'
    } as CSSProperties
    let labelStyle = {
        padding: '0px',
        color: 'white',
        direction: 'rtl'
    } as CSSProperties
    let headerStyle = {
        padding: '0px',
        color: 'white',
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
        direction: 'rtl'
    } as CSSProperties


    useEffect(() => {
        props.headerExt!.hideHeader()
    }, [])

    const fill = {
        style: inputStyle,
        initialValue: '',
        mandatory: true,
        type: "text"
    }
    const secLabelStyle = {
        fontWeight: 'bold',
        maxWidth: '300px',
        fontSize: '12px',
        color: SECONDARY_WHITE
    }
    const standAlone = {
        ...fill,
        name: 'Arg1',
        style: {
            height: '50px',
            minWidth: '250px',
            borderRadius: '12px',
            wordBreak: 'break-word',
        },
        label: 'תוכן הודעה',
        placeHolder: 'הכנס תוכן הודעה יחד עם פרמטרים '
    } as SimpleFormField
    const [sa, couple] = [[1], [3, 4]].map((n) => n.map(x => ({
        ...fill,
        name: 'Arg1',
        label: `ערך בהתאמה ${x}`,
        placeHolder: `הכנס ערך בהתאמה ${x}`
    }))) as SimpleFormField[][]

    const couples = [[1, 2]].map((n) => n.map(x => ({
        ...fill,
        name: 'Arg1',
        label: `פרמטר ${x}`,
        placeHolder: `הכנס פרמטר ${x}`
    }))) as SimpleFormField[][]

    useEffect(() => {
        if (location && !sacState)
            setSacState(location.state as SMSState)
    }, [])
    function sendSMSRequest(state: string) {
        props.loading!.doLoad()
        if (sacState && sacState.ride) {
            ServerRequest<ServerResponse>('sendridesms', {
                ride: sacState.ride,
                text: state
            }, result => {
                props.loading!.cancelLoad()
                if (result.success) alert(result.success)
                else if (result.error) alert(result.error)
            }, error => {
                props.loading!.cancelLoad()
                alert(error)
            })
        } else if (sacState && sacState.client) {
            ServerRequest<ServerResponse>('sendclientsms', {
                client: sacState.client,
                text: state
            }, result => {
                props.loading!.cancelLoad()

                if (result.success)
                    alert(result.success)
                else if (result.error)
                    alert(result.error)
            }, error => {
                props.loading!.cancelLoad()
                alert(error)
            })
        } else {
            props.loading!.cancelLoad()

        }
    }
    const labelHeaderStyle = {
        color: SECONDARY_WHITE,
        fontWeight: 'bold'
    }

    return sacState ? <PageHolder style={{ overflow: 'hidden' }}>
        {sacState && sacState.ride ? <label style={labelHeaderStyle} dir={'rtl'}>{`שליחת הודעה לנוסעים מנקודת יציאה:`}<b style={{ display: 'block' }}>{sacState.ride.rideStartingPoint}</b></label>
            : location && sacState.client ? <label style={labelHeaderStyle}>{`שליחת הודעה ללקוח: ${sacState.client.customerName}`}</label> : null}
        < SimpleForm layout="grid"
            numCols={2}
            numRows={1}
            style={{ overflow: 'hidden' }}
            rowGap={2}
            colGap={32}
            standAloneFields={[standAlone]}
            onSubmit={(state => {
                sendSMSRequest(Object.values(state)[0])
            })} />

        <label dir='rtl' style={secLabelStyle}>
            {'דוגמא: '}
        </label>
        <label style={secLabelStyle}>
            {`תוכן הודעה: שלום [שם] בדוק את המייל שלך לאישור נסיעה אשר נשלח ל[אימייל]`}
        </label>
        <Spacer offset={1} />
        <label dir="rtl" style={{ ...secLabelStyle, fontSize: '10px' }}>
            {'פרמטרים בנויים:'}
        </label>
        <label dir="rtl" style={{ ...secLabelStyle, fontSize: '10px' }}>
            {sacState.ride ? '[שם], [אימייל] , [טלפון], [אירוע], [נקודת_יציאה] ,[שעת_יציאה] ,[תאריך_נסיעה]' : '[שם], [אימייל] , [טלפון]'}
        </label>
    </PageHolder> : <Navigate to='/' />
}


export default withHookGroup(SMS, ['user', 'loading', 'nav', 'headerExt', 'backgroundExt'])