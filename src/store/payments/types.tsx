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

export type CardInformation = {
    "brand_id": string
    "card_bin": string
    "card_foreign": string
    "clearing_id": string
    "expiry_month": string
    "expiry_year": string
    "four_digits": string
    "issuer_id": string
    "token": string
}
export type TransactionItem = {
    "amount_pay": number,
    "discount_amount": number,
    "name": string,
    "product_uid": string,
    "quantity": number,
    "quantity_price": number,
    "vat": number
}

export type TransactionData = {
    "card_information": CardInformation
    "cashier_name": string
    "cashier_uid": string
    "customer_email": string
    "customer_uid": string
    "items": TransactionItem[]
    "terminal_uid": string
    "transaction": TransactionItem
    "secure3D": { status: string }
    "status_code": string
    "type": string
    "uid": string
    "voucher_number": string
}

export type CreditCardTransaction = {
    customer: Customer
    data: TransactionData
    results?: {
        code: Number
        description: string
        gateway_error_code: string
        status: string
    }
    date: string
    credit_card?: CreditCard | null
    product: { name: string, price: string, amount: string }
}
