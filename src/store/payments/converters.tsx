import { DataSnapshot } from "firebase/database";
import { CreditCardTransaction } from "./types";

export const transactionFromDict = (snap: DataSnapshot): CreditCardTransaction => {
    const customer = snap.child('customer').val()
    const product = snap.child('product').val()
    const data = snap.child('data').val()
    const results = snap.child('results').val()
    const date = snap.child('date').val()
    return { customer: customer, product: product, data: data, date: date, results: results }
}