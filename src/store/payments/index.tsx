
import axios from "axios"
import { PNPUser } from "../external/types"
const paymentsAPIRoutes = {
    charge: 'https://www.nadavsolutions.com/gserver/transaction',
    newCustomer: 'https://www.nadavsolutions.com/gserver/newcustomer'
}

export const createNewCustomer = async (createError: ((type: string, e: any) => any), user: PNPUser) => {
    return await axios.post(paymentsAPIRoutes.newCustomer,
        { customer: { email: user.email, customer_name: user.name } },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data.data.customer_uid
        }).catch(e => { createError('createNewCustomer', { error: e, email: user.email }) })
}
