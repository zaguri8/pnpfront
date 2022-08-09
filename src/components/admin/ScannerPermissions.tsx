import { Stack, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Unsubscribe } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../context/Firebase";
import { useLoading } from "../../context/Loading";
import { SECONDARY_WHITE } from "../../settings/colors";
import { textFieldStyle } from "../../settings/styles";
import { PNPEvent } from "../../store/external/types";
import { buttonStyle } from "./InvitationStatistics";
import './UserStatistics.css'
export default function ScannerPermissions(props: { event: PNPEvent }) {
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE))

    const { firebase } = useFirebase()
    const { cancelLoad, doLoad } = useLoading()

    const [scanners, setScanners] = useState<string[] | undefined>()

    useEffect(() => {
        let sub: Unsubscribe | undefined;
        if (props.event && !scanners) {
            sub = firebase.realTime.getAllScanners(props.event.eventId, setScanners)
        }
        return () => sub && sub()
    }, [props.event])

    function giveUserPermissions() {
        const email = $('#user_barcode_give_permissions_input').val() as string
        if (!email) { alert('יש להכניס אימייל'); return; }
        doLoad()
        firebase.realTime.giveScannerPermissionsByEmail(email, props.event.eventId).then(() => {
            cancelLoad()
            alert(`המשתמש ${email} קיבל גישות סורק`)
        }).catch(() => {
            cancelLoad()
            alert('אירעתה שגיאה בעת מתן גישות')
        })
    }


    function takeUserPermissions() {
        const email = $('#user_barcode_take_permissions_input').val() as string
        firebase.realTime.takeScannerPermissionsByEmail(email).then(() => {
            cancelLoad()
            alert(`המשתמש ${email} איבד גישות סורק`)
        }).catch(() => {
            cancelLoad()
            alert('אירעתה שגיאה בעת לקיחת גישות')
        })
    }
    const classes = useStyles()
    return <div className='scanner_perms_container'>
        <Stack direction={'row'}>


            <Stack spacing={0.5}>
                <TextField
                    classes={classes}
                    id='user_barcode_give_permissions_input'
                    placeholder="תן גישות סורק לפי אימייל" />
                <button style={{ ...buttonStyle, transform: 'scale(0.8)' }} onClick={giveUserPermissions}>
                    תן גישות סורק
                </button>
            </Stack>
            <Stack spacing={0.5}>
                <TextField
                    classes={classes}
                    id='user_barcode_take_permissions_input'
                    placeholder="קח גישות סורק לפי אימייל" />
                <button style={{ ...buttonStyle, transform: 'scale(0.8)' }} onClick={takeUserPermissions}>
                    קח גישות סורק
                </button>
            </Stack>
        </Stack>
        {scanners && scanners.length > 0 && <React.Fragment>
            <span style={{ color: 'white', padding: '8px' }}>רשימת סורקים</span>
            <ul>
                {scanners.map(scanner => <li key={scanner}>
                    scanner
                </li>)}
            </ul>
        </React.Fragment>}
    </div>

}