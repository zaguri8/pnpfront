import { useEffect, useState } from "react"
import { useFirebase } from "../context/Firebase"
import axios from 'axios'


function Test() {

    const { appUser, firebase } = useFirebase()



    const [paymentLink, setPaymentLink] = useState()
    const makePage = () => {

    }

    useEffect(() => {
        if (appUser != null) {
            const customer = {
                customer_name: appUser.name,
                email: appUser.email,
                phone: appUser.phone
            }

            axios.post('https://nadavsolutions.com/gserver/paymentLink', { customer: customer })
                .then(res => {
                    if (res.data.data) {
                        setPaymentLink(res.data.data.payment_page_link)
                    }
                }).catch(e => {
                })
        }
    }, [])
    return <div><iframe src={paymentLink}></iframe></div>
}

export default Test