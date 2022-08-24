import { Button, Dialog, List, ListItem, Stack } from "@mui/material";
import React from "react";
import { PRIMARY_BLACK, PRIMARY_ORANGE } from "../../settings/colors";
import { CLOSE, SIDE } from "../../settings/strings";

export default function PNPDialogComponent(props: { lang: string, dialogContext: any }) {
    return (<Dialog dir={SIDE(props.lang)} sx={{
        textAlign: 'center',
        overflowY: 'stretch',
        zIndex: '3000',
        overflowX: 'hidden',
        background: 'none'
    }} open={props.dialogContext.isDialogOpened}>
        {props.dialogContext.dialogTitle && <div style={{
            display: 'flex',
            color: PRIMARY_BLACK,
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            justifyContent: 'center'
        }}>{props.dialogContext.dialogTitle}</div>}
        <List id='dialog' sx={{
            overflowX: 'hidden',
            maxHeight: '800px',

            minWidth: '300px',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {props.dialogContext.content.content}
        </List>
        <ListItem style={{
            marginTop: '0px',
            paddingTop: '8px',
            color: PRIMARY_BLACK
        }}>
            <Stack style={{ width: '100%' }} alignItems={'center'} spacing={1}>

                {props.dialogContext.dialogBottom && <React.Fragment>
                    {props.dialogContext.dialogBottom}
                </React.Fragment>}
                <Button onClick={() => {
                    props.dialogContext.closeDialog();
                }} style={{
                    width: '100%',
                    color: PRIMARY_ORANGE,
                    border: '1px solid lightgray',
                    fontWeight: 'bold',
                    background: 'white',
                    borderRadius: '12px',
                    fontFamily: 'Open Sans Hebrew',
                    fontSize: '18px'
                }}>{CLOSE(props.lang)}</Button>
            </Stack>
        </ListItem>
    </Dialog>);
}

