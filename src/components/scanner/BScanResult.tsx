import { useLocation, useNavigate } from "react-router"
import React, { useEffect, useState } from 'react'
import { useFirebase } from "../../context/Firebase"
import { Unsubscribe } from "firebase/database"
import { PNPTransactionConfirmation } from "../../store/external/types"
import Spacer from "../utilities/Spacer"
import { SECONDARY_WHITE } from "../../settings/colors"
import { useLoading } from "../../context/Loading"
import { Button } from "@mui/material"
function useQuery() {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function BScanResult() {

    const queries = useQuery()


    const { firebase } = useFirebase()

    const [confirmation, setConfirmation] = useState<PNPTransactionConfirmation | undefined>()
    useEffect(() => {
        let unsub: Unsubscribe | undefined;
        if (queries.has('confirmationVoucher')) {
            unsub = firebase.realTime
                .addListenerToTransactionConfirmation(queries.get('confirmationVoucher')!, (c) => {
                    setConfirmation(c)
                })
        }
        return () => unsub && unsub as Unsubscribe && (unsub as Unsubscribe)()
    })

    const nav = useNavigate()

    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()

    function getElem() {

        // TWO WAY means 2 ways
        // ridesLeft === 2 means Its the First Direction
        // ridesLeft === 1 means its the second Direction
        if (confirmation && confirmation.isValid && confirmation.twoWay) {
            return (
                <div>
                    {(confirmation && confirmation.isValid) && confirmation.ridesLeft === 2 &&
                        (<button
                            style={{ margin: '4px' }}
                            onClick={() => {
                                openDialog({
                                    content: <div style={{ padding: '6px', color: SECONDARY_WHITE }}>

                                        <label style={{ color: SECONDARY_WHITE, padding: '6px', margin: '4px' }}>{'מימוש נסיעה, כיוון : הלוך'}</label>
                                        <Button
                                            onClick={() => {
                                                doLoad()
                                                firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, 1)
                                                    .then(() => {
                                                        cancelLoad()
                                                        closeDialog()
                                                        alert('נסיעה הלוך מומשה')
                                                        nav('/scan')
                                                    }).catch((e) => {
                                                        cancelLoad()
                                                        closeDialog()
                                                        alert('נסיעה לא מומשה')
                                                    })
                                            }}
                                            style={{
                                                width: '75%',
                                                textTransform: 'none',
                                                margin: '8px',
                                                fontSize: '16px'
                                            }}>
                                            {'בצע מימוש נסיעה הלוך'}
                                        </Button>
                                    </div>
                                })
                            }}>{'ממש נסיעה הלוך'}</button>)}
                    <hr />
                    {(confirmation && confirmation.isValid) && confirmation.ridesLeft === 1 &&
                        <button
                            style={{ margin: '4px' }}
                            onClick={() => {
                                openDialog({
                                    content: <div style={{ padding: '6px', color: SECONDARY_WHITE }}>

                                        <label style={{ color: SECONDARY_WHITE, padding: '6px', margin: '4px' }}>{'מימוש נסיעה, כיוון : הלוך'}</label>
                                        <Button
                                            onClick={() => {
                                                doLoad()
                                                firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, 0)
                                                    .then(() => {
                                                        cancelLoad()
                                                        closeDialog()
                                                        alert('נסיעה חזור מומשה')
                                                        nav('/scan')
                                                    }).catch((e) => {
                                                        cancelLoad()
                                                        closeDialog()
                                                        alert('נסיעה לא מומשה')
                                                    })
                                            }}
                                            style={{
                                                width: '75%',
                                                textTransform: 'none',
                                                margin: '8px',
                                                fontSize: '16px'
                                            }}>
                                            {'בצע מימוש נסיעה חזור'}
                                        </Button>
                                    </div>
                                })
                            }}>{'ממש נסיעה חזור'}</button>}
                </div>
            )
        } else if (confirmation?.ridesLeft === 2) {
            return <div>
                {(confirmation && confirmation.isValid) && <button
                    style={{ margin: '4px' }}
                    onClick={() => {
                        firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, 0)
                            .then(() => {
                                alert('נסיעה הלוך מומשה')
                                nav('/scan')
                            }).catch((e) => {
                                alert('הנסיעה לא מומשה')
                            })
                    }}>{'ממש נסיעה הלוך'}</button>}
            </div>
        } else if (confirmation?.ridesLeft === 1) {
            return <div>
                {(confirmation && confirmation.isValid) && <button
                    style={{ margin: '4px' }}
                    onClick={() => {
                        firebase.realTime.invalidateTransactionConfirmations(confirmation.confirmationVoucher, 0)
                            .then(() => {
                                alert('נסיעה חזור מומשה')
                                nav('/scan')
                            }).catch((e) => {
                                alert('הנסיעה לא מומשה')
                            })
                    }}>{'ממש נסיעה חזור'}</button>}
            </div>
        } else {
            return null
        }
    }

    return <div>
        <h1 style={{ color: (confirmation && confirmation.isValid) ? 'green' : '#bd3333' }}>{(confirmation && confirmation.isValid) ? 'אישור בתוקף' : 'אישור לא בתוקף'}</h1>
        <Spacer offset={1} />

        {getElem()}

    </div>
}