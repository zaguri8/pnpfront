import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { SECONDARY_WHITE } from "../settings/colors";
import { Welcome } from '../components/auth/Welcome'
import { useLoading } from "../context/Loading";
import ForgotPass from "./auth/ForgotPass";
function Test() {


    return <ForgotPass />
}

export default Test