export type Customer = {
    customer_name: string
    email: string
}
export type CreditCard = {
    auth_number: string
    exp_mm: string
    exp_yy: string
    number: string
}
export type Payments = {
    number: number
    first_amount: number
    nonfirst_amount: number

}

export type TransactionSuccess = {
    amount: string,
    transaction_uid: string,
    customer_uid: string,
    status_description: string,
    currency: string,
    date: string,
    card_holder_name: string,
    more_info: string,
    number_of_payments: string,
    method: string,
    approval_num: string,
    four_digits: string
}

export type TransactionFailure = {
    transactionProduct: string
    transactionTotalAmount: string
    transactionTotalPrice: string
    transactionDate: string
    status_description: string
    transactionId: string
}