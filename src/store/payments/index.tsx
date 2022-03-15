
import { formLabelClasses } from "@mui/material"
import axios from "axios"
import { Auth } from "firebase/auth"
import { Database } from "firebase/database"
import { Realtime } from "../external"
import { PNPUser } from "../external/types"
const paymentsAPIRoutes = {
    charge: 'https://nadavsolutions.com/gserver/transaction',
    newCustomer: 'https://nadavsolutions.com/gserver/newcustomer'
}

export const createNewCustomer = async (user: PNPUser) => {
    return await axios.post(paymentsAPIRoutes.newCustomer,
        { customer: { email: user.email, customer_name: user.name } },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data.data.customer_uid
        })
}
