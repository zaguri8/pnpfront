import { Stack, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Unsubscribe } from "firebase/database";
import React, { useEffect, useState } from "react";
import { SECONDARY_WHITE } from "../../settings/colors";
import { textFieldStyle } from "../../settings/styles";
import { StoreSingleton } from "../../store/external";
import { PNPEvent } from "../../store/external/types";
import { Hooks } from "../generics/types";
import {  withHookGroup } from "../generics/withHooks";
import { buttonStyle } from "./InvitationStatistics";
import './UserStatistics.css'

type ScannerPermissionsProps = { event: PNPEvent }
function ScannerPermissions(props: ScannerPermissionsProps & Hooks) {
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE))
    const [scanners, setScanners] = useState<string[] | undefined>()

    useEffect(() => {
        let sub: Unsubscribe | undefined;
        if (props.event && !scanners) {
            sub = StoreSingleton.get().realTime.getAllScanners(props.event.eventId, setScanners)
        }
        return () => sub && sub()
    }, [props.event])

    function giveUserPermissions() {
        const email = $('#user_barcode_give_permissions_input').val() as string
        if (!email) { alert('יש להכניס אימייל'); return; }
        props.loading.doLoad()
        StoreSingleton.get().realTime.giveScannerPermissionsByEmail(email, props.event.eventId).then(() => {
            props.loading.cancelLoad()
            alert(`המשתמש ${email} קיבל גישות סורק`)
        }).catch(() => {
            props.loading.cancelLoad()
            alert('אירעתה שגיאה בעת מתן גישות')
        })
    }


    function takeUserPermissions() {
        const email = $('#user_barcode_take_permissions_input').val() as string
        StoreSingleton.get().realTime.takeScannerPermissionsByEmail(email).then(() => {
            props.loading.cancelLoad()
            alert(`המשתמש ${email} איבד גישות סורק`)
        }).catch(() => {
            props.loading.cancelLoad()
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
export default withHookGroup<ScannerPermissionsProps>(ScannerPermissions, ['loading','user'])