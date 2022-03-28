import { DataSnapshot } from "firebase/database";
import { TransactionFailure, TransactionSuccess } from "./types";
export const transactionSuccessFromDict = (snap: DataSnapshot): TransactionSuccess => {

    const amount = snap.child("amount")
    const transaction_uid = snap.child("transaction_uid")
    const customer_uid = snap.child("customer_uid")
    const status_description = snap.child("status_description")
    const currency = snap.child("currency")
    const date = snap.child("date")
    const card_holder_name = snap.child("card_holder_name")
    const more_info = snap.child("more_info")
    const number_of_payments = snap.child("number_of_payments")
    const method = snap.child("method")
    const approval_num = snap.child("approval_num")
    const four_digits = snap.child("four_digits")
    return {
        amount: amount.val(),
        transaction_uid: transaction_uid.val(),
        customer_uid: customer_uid.val(),
        status_description: status_description.val(),
        currency: currency.val(),
        date: date.val(),
        card_holder_name: card_holder_name.val(),
        more_info: more_info.val(),
        number_of_payments: number_of_payments.val(),
        method: method.val(),
        approval_num: approval_num.val(),
        four_digits: four_digits.val()
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