import './PrivatePaymentForm.css'
import { PProductData, PCustomerData, PPaymentPageData } from '../../../store/external/types'
import { InnerPageHolder, PageHolder } from '../../utilities/Holders'
import { useEffect, useState } from 'react'
import { BLACK_ELEGANT } from '../../../settings/colors'
import axios from 'axios'
import { useLoading } from '../../../context/Loading'
import { useParams } from 'react-router'
import serverRequest from '../../../ApiManager/ApiManager'
export default function PrivatePaymentForm() {

    const { customerEmail } = useParams()
    const [paymentLink, setPaymentLink] = useState()
    const { doLoad, cancelLoad } = useLoading()
    useEffect(() => {
        doLoad()
        serverRequest('privatePaymentLink', { customerEmail: customerEmail },
            (data: any) => {
                if (data.err) {
                    cancelLoad()
                    alert(data.err)
                    return;
                }
                if (data && data.data && data.data.payment_page_link) {
                    const link = data.data.payment_page_link
                    setPaymentLink(link)
                    cancelLoad()
                } else {
                    cancelLoad()
                    alert('אירעתה שגיאה בבקשת דף תשלום, אנא פנא למתכנת')
                }
            }, (error: any) => {
                cancelLoad()
                alert(error)
                return;
            })
    }, [])
    return <PageHolder>
        <InnerPageHolder style={
            {
                background: BLACK_ELEGANT,
                border: '.1px solid gray'
            }}>
            {paymentLink ? <iframe className='_private_payment_link_frame'
                src={paymentLink} /> :
                <iframe className='_private_payment_link_frame' />}
        </InnerPageHolder>

    </PageHolder>
}