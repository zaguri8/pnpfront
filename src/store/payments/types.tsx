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
export type CreditCardTransaction = {
    customer: Customer
    credit_card: CreditCard
    terminal_uid: string
    cashier_uid: string
    amount: number
    credit_terms: number
    currency_code: string
    use_token: boolean,
    create_token: boolean
    payments: Payments
    extra_info: string
}
