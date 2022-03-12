
import { formLabelClasses } from "@mui/material"
import axios from "axios"
import { Auth } from "firebase/auth"
import { Database } from "firebase/database"
import { Realtime } from "../external"
import { PNPUser } from "../external/types"
import { isValidTransaction } from "../validators"
import { CreditCardTransaction } from "./types"
const paymentsAPIRoutes = {
    charge: 'https://nadavsolutions.com/gserver/transaction',
    newCustomer: 'https://nadavsolutions.com/gserver/newcustomer'
}

export const chargeCreditCard = async (user: PNPUser, transaction: CreditCardTransaction, realTime: Realtime) => {
    if (!isValidTransaction(transaction) || !user.customerId) {
        return false
    }
    return await axios.post(paymentsAPIRoutes.charge, transaction, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (response.data && response.data.data) {
                if (response.data.data.results) {
                    realTime.addTransaction({ ...response.data.data, product: transaction.product, date: new Date().toISOString() }, response.data.data.results.status === 'error' ? 'failure' : 'success')
                }
            }
            return response.data
        }).catch(err => {
            return { error: err, data: null }
        })
}

export const createNewCustomer = async (user: PNPUser) => {
    return await axios.post(paymentsAPIRoutes.newCustomer,
        { customer: { email: user.email, customer_name: user.name } },
        { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            return response.data.data.customer_uid
        })
}
