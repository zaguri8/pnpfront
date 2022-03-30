import { useLocation, useNavigate } from "react-router"
import React, { useEffect, useState } from 'react'
import { useFirebase } from "../../context/Firebase"
import { Unsubscribe } from "firebase/database"
import { PNPTransactionConfirmation } from "../../store/external/types"
import Spacer from "../utilities/Spacer"
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY, SECONDARY_WHITE } from "../../settings/colors"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useLoading } from "../../context/Loading"
import { Button, Stack } from "@mui/material"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { submitButton } from "../../settings/styles"
function useQuery() {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function BScanResult() {

    const queries = useQuery()
    const { firebase } = useFirebase()
    const nav = useNavigate()
    const { doLoad, cancelLoad, openDialog } = useLoading()

    const decline = () => {
        cancelLoad()
        openDialog({
            content: <Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ padding: '8px', color: SECONDARY_WHITE,fontWeight:'600' }}>{'נסיעה לא מאושרת'}</label>
                <ErrorOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'white', width: '64px', height: '64px', color: '#bd3333' }} />
            </Stack>
        })
        nav('/scan', { state: true })
    }

    const approve = (confirmation: PNPTransactionConfirmation) => {
        cancelLoad()
        openDialog({
            content: <Stack style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ padding: '8px', color: SECONDARY_WHITE,fontWeight:'600'}}>{'נסיעה מאושרת'}</label>
                <label style={{ padding: '8px', color: SECONDARY_WHITE }}>{'מספר נוסעים: '}<b>{confirmation.amount}</b></label>
                <CheckCircleOutlineIcon style={{ alignItems: 'center', borderRadius: '32px', background: 'white', width: '64px', height: '64px', color: '#4BB543' }} />
            </Stack>
        })
        nav('/scan', { state: true })
    }
    useEffect(() => {
        if (queries.has('confirmationVoucher')) {
            firebase.realTime
                .addListenerToTransactionConfirmation(queries.get('confirmationVoucher')!, (c) => {
                    doLoad()
                    if (c.ridesLeft === 0) {
                        decline()
                    } else {
                        firebase.realTime.invalidateTransactionConfirmations(c.confirmationVoucher, c.twoWay ? (c.ridesLeft === 2 ? 1 : 0) : 0)
                            .then(() => { approve(c) })
                            .catch(decline)
                    }
                })
        }
    }, [])

    return <div>{''}</div>
}