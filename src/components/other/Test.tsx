import { Button, Stack } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"
import React, { CSSProperties, ReactElement, ReactNode } from "react"
import SimpleForm from "../simpleForm/SimpleForm"
import Barcode from "./Barcode"

export default function Test() {

    return <div>
        <Barcode transaction={{ approval_num: "000000" }} />
    </div>
}