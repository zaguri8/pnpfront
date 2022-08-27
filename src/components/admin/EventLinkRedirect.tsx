import { CSSProperties, useEffect } from "react";
import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { textFieldStyle } from "../../settings/styles";
import { PRIMARY_PINK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { FirebaseTools } from "../../store/external";
import { PNPEvent } from "../../store/external/types";
import $ from 'jquery'
import { withHook } from "../generics/withHooks";
import { Hooks } from "../generics/types";
type EventLinkRedirectProps = {
    event: PNPEvent,
    linkRedirect: string | undefined | null,
    firebase: FirebaseTools
}
function EventLinkRedirect(props: EventLinkRedirectProps & Hooks) {
    const useStyles = makeStyles(textFieldStyle(SECONDARY_WHITE, { border: `1px solid ${PRIMARY_PINK}`, margin: '0px', height: '40px', padding: '0px', direction: 'rtl' }))
    const classes = useStyles()


    const linkCode = async () => {
        let path = $('#link_code_admin').val() as string
        if (!path) {
            alert('יש להכניס קוד זימון תקין')
            return
        }
        props.loading.doLoad()
        props.firebase.realTime.setLinkRedirect(path,
            `https://www.pick-n-pull.co.il/#/event/${props.event.eventId}`,
            (link) => {
                if (link === null) {
                    alert('אירעתה שגיאה ביצירת הלינק, אנא פנא אל המתכנת')
                    return
                }
                props.loading.cancelLoad()
                alert(`לינק נוסף בהצלחה, ${link}`)
            }
        )
    }
    const buttonStyle = {
        textTransform: 'none',
        background: PRIMARY_PINK,
        color: 'white',
        fontFamily: 'Open Sans Hebrew',
        padding: '4px'
    } as CSSProperties

    const labelStyle = {
        color: 'white',
        fontSize: '12px'
    } as CSSProperties
    return <Stack spacing={1}>
        <TextField id='link_code_admin' classes={classes} placeholder={"הכנס קוד זימון"} />
        <Button onClick={linkCode} style={buttonStyle}>
            {'צור לינק'}
        </Button>

        {props.linkRedirect && <React.Fragment><label dir={'rtl'} style={labelStyle}>{'לינק נוכחי: '}</label>
            <label dir={'rtl'} style={labelStyle}>{props.linkRedirect}</label>
        </React.Fragment>}
    </Stack>

}
export default withHook<EventLinkRedirectProps>(EventLinkRedirect, 'loading')