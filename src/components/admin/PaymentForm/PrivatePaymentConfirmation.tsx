import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useUser } from "../../../context/Firebase";
import { useLoading } from "../../../context/Loading";
import { SECONDARY_WHITE } from "../../../settings/colors";
import { StoreSingleton } from "../../../store/external";
import { PCustomerData, PPaymentPageData, PProductData } from "../../../store/external/types";
import { InnerPageHolder, PageHolder } from "../../utilityComponents/Holders";
// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function PrivatePaymentConfirmation() {

    const query = useQuery()
    const nav = useNavigate()
    const [paymentData, setPaymentData] = useState<{ customer: PCustomerData, product: PProductData } | undefined>()
    const { doLoad, cancelLoad } = useLoading()
    useEffect(() => {
        if (query.get('customerEmail') && query.get('customerEmail') !== null) {
            doLoad()
            StoreSingleton.getTools().realTime
                .getPendingPrivateTransaction(query.get('customerEmail')!)
                .then((data) => {
                    setPaymentData(data)
                    cancelLoad()
                })
                .catch(() => { cancelLoad(); nav('/') })
        }
    }, [query])
    return <PageHolder>
        {(paymentData && paymentData.customer !== undefined && paymentData.customer !== null) && < InnerPageHolder style={{ background: 'none', border: 'none' }}>
            <h1 dir='rtl' style={{ color: SECONDARY_WHITE }}>{'תודה, ' + paymentData.customer.customer_name}</h1>
            <Stack spacing={1.2}>
                <h4 dir='rtl' style={{ color: SECONDARY_WHITE }}>{'אישור עסקה עם Pick n Pull'}</h4>
                <span dir='rtl' style={{ color: SECONDARY_WHITE }}>{`סה"כ שולם: ` + paymentData.product.price}</span>
                <span dir='rtl' style={{ color: SECONDARY_WHITE }}>עבור מוצר: {paymentData.product.name}</span>
            </Stack>
        </InnerPageHolder>
        }
    </PageHolder >
}