import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { useFirebase } from "../../context/Firebase";
import { useLanguage } from "../../context/Language";
import { useLoading } from "../../context/Loading";
import { NOTFOUND, SIDE } from "../../settings/strings";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";

export default function TransactionSuccessPage() {
    const [searchParams] = useSearchParams();
    const { lang } = useLanguage()
    const { doLoad, cancelLoad } = useLoading()
    const { firebase } = useFirebase()
    useEffect(() => {
        if (searchParams) {
            doLoad()
            if (searchParams.get('status_description') === 'העסקה בוצעה בהצלחה') {
                firebase.realTime.addSuccessfulTransaction({
                    transactionDate: searchParams.get('date') ?? "",
                    transactionProduct: searchParams.get('more_info')?.split(',')[0] ?? "",
                    status_description: searchParams.get('status_description') ?? '',
                    transactionId: searchParams.get('transaction_uid') ?? "",
                    transactionTotalAmount: searchParams.get('more_info')?.split(',')[1] ?? "1",
                    transactionTotalPrice: searchParams.get('amount') ?? ""
                }).then(() => cancelLoad()).catch(() => cancelLoad())
            } else if (searchParams.get('status_description')) {
                firebase.realTime.addFailureTransaction({
                    transactionDate: searchParams.get('date') ?? "",
                    transactionProduct: searchParams.get('more_info')?.split(',')[0] ?? "",
                    status_description: searchParams.get('status_description') ?? '',
                    transactionId: searchParams.get('transaction_uid') ?? "",
                    transactionTotalAmount: searchParams.get('more_info')?.split(',')[1] ?? "1",
                    transactionTotalPrice: searchParams.get('amount') ?? ""
                }).then(() => cancelLoad()).catch(() => cancelLoad())
            }
        }
    }, [])
    return (searchParams.get('status') && searchParams.get('status_description') ? <PageHolder>
        <InnerPageHolder>
            <Stack spacing={3} dir={SIDE(lang)}>
                <span style={{ fontWeight: 'bold' }}>{"מוצר : "}</span>
                <br />
                <span> {searchParams.get('more_info')}</span>
                {searchParams.get('status') === 'rejected' && <span>{"פירוט :  " + searchParams.get('status_description')}</span>}
                <span style={{ fontWeight: 'bold' }}>{"סטאטוס :"}</span>
                <br />
                <span style={{ color: searchParams.get('status_description') === 'העסקה בוצעה בהצלחה' ? 'green' : 'red' }}>{searchParams.get('status_description')}</span>
                {searchParams.get('status_description') === 'העסקה בוצעה בהצלחה' && <div>
                    <span style={{ fontWeight: 'bold' }}>{"מספר תשלומים :"}</span>
                    <br />
                    <span>{searchParams.get('payments')}</span>
                    <br />
                    <span style={{ fontWeight: 'bold' }}>{`סה"כ שולם :`}</span>
                    <br />
                    <span>{searchParams.get('amount')}</span>
                    <br />
                    <br />
                    <span style={{ fontWeight: 'bold' }}>{'את/ה יכול/ה כעת לראות את הזמנתך בהיסטוריית הנסיעות ובאימייל'}</span>
                </div>}
            </Stack>
        </InnerPageHolder>
    </PageHolder> : <h1>{NOTFOUND(lang)}</h1>
    )
}