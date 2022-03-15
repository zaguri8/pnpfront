import { DataSnapshot } from "firebase/database";
import { TransactionFailure, TransactionSuccess } from "./types";
export const transactionSuccessFromDict = (snap: DataSnapshot): TransactionSuccess => {
    const transactionId = snap.child('customer').val()
    const product = snap.child('product').val()
    const transactionTotalAmount = snap.child('transactionTotalAmount').val()
    const transactionTotalPrice = snap.child('transactionTotalPrice').val()
    const status_description = snap.child('status_description').val()
    const date = snap.child('date').val()
    return {
        transactionProduct: product,
        transactionTotalAmount: transactionTotalAmount,
        transactionTotalPrice: transactionTotalPrice,
        transactionDate: date,
        transactionId: transactionId,
        status_description: status_description
    }
}
export const transactionFailureFromDict = (snap: DataSnapshot): TransactionFailure => {
    const transactionId = snap.child('customer').val()
    const product = snap.child('product').val()
    const transactionTotalAmount = snap.child('transactionTotalAmount').val()
    const transactionTotalPrice = snap.child('transactionTotalPrice').val()
    const status_description = snap.child('status_description').val()
    const date = snap.child('date').val()
    return {
        transactionProduct: product,
        transactionTotalAmount: transactionTotalAmount,
        transactionDate: date,
        transactionTotalPrice: transactionTotalPrice,
        transactionId: transactionId,
        status_description: status_description
    }
}