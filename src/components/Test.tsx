import { Button, Stack } from "@mui/material"
import React, { useEffect } from "react"
import { useLoading } from "../context/Loading"
import { submitButton } from "../settings/styles"
import { PageHolder } from "./utilities/Holders"

export default function Test() {
    const { showPopover, closePopover } = useLoading()
    const doTest = () => {
        showPopover(<Stack>
            <label>{"מספר נוסעים: "}</label><b>4</b>
            <label>{"שם אירוע: "}</label><b>CHAN HASHAYAROT</b>
            <label>{"יעד נסיעה: "}</label><b>Tel Aviv בורסא</b>
        </Stack>, 'success')
    }
    return <div>
        <Button onClick={doTest} style={{
            ...submitButton(4),
            textTransform: 'none',
            fontWeight: 'bold',
            border: '1px solid white'
        }}>
            Open popover
        </Button>
    </div>
}