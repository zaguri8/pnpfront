import { Stack } from "@mui/material";
import { useState } from "react";
import {QRCodeSVG} from 'qrcode.react';
import { SECONDARY_WHITE } from "../settings/colors";
function Test() {


    return <div>
        <QRCodeSVG style = {{width:'300px',height:'300px'}} value="5454" />,
    </div>
}

export default Test