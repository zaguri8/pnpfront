
import axios from "axios"
import ServerRequest from "../../network/serverRequest"
import { PNPUser } from "../external/types"
const paymentsAPIRoutes = {
    charge: 'https://www.nadavsolutions.com/gserver/transaction',
    newCustomer: 'https://www.nadavsolutions.com/gserver/newcustomer'
}

export const createNewCustomer = async (createError: ((type: string, e: any) => any), user: PNPUser) => {
    return new Promise((accept, reject) => {
        const send = {
            customer: { email: user.email, customer_name: user.name }
        }
        ServerRequest<{ data: { customer_uid: string } }>('newcustomer', send, res => accept(res.data.customer_uid), e => {
            createError('createNewCustomer', { error: e, email: user.email })
            reject(e)
        })
    })
}

