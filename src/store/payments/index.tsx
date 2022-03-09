
import { formLabelClasses } from "@mui/material"
import { Auth } from "firebase/auth"
import { Database } from "firebase/database"
import { Realtime } from "../external"
import { PNPUser } from "../external/types"
import { isValidTransaction } from "../validators"
import { CreditCardTransaction } from "./types"


const basePaymentsAPI = "https://restapidev.payplus.co.il/api/v1.0"
const paymentsAPIRoutes = {
    charge: basePaymentsAPI + '/Transactions/Charge',
    customersAdd: basePaymentsAPI + '/Customers/Add',
    customers: basePaymentsAPI + '/Customers/View/'
}
const paymentAPIHeaders = {
    'Authorization': JSON.stringify({
        "api_key": process.env.REACT_APP_PAYME_API_KEY,
        "secret_key": process.env.REACT_APP_PAYME_SECRET_KEY
    })
}

export const chargeCreditCard = async (user: PNPUser, transaction: CreditCardTransaction, realTime: Realtime) => {
    if (isValidTransaction(transaction) && user.customerId)
        return false
    return await fetch(paymentsAPIRoutes.charge,
        {
            headers: paymentAPIHeaders, method: 'POST',
            body: JSON.stringify(transaction)
        }).then(() => realTime.addTransaction(transaction))
        .catch(err => console.log(err))
}

export const createNewCustomer = async (user: PNPUser, auth: Auth, db: Database) => {
    return await fetch(paymentsAPIRoutes.customersAdd, { body: JSON.stringify({ email: user.email, customer_name: user.name }) })
        .then(response => response.json())
        .then(customer => Realtime.updateCurrentUser({ customerId: customer.data.customer_uid }, auth, db))
        .catch(e => {
            Realtime.createError('createNewCustomer', e, db)
        })
}
