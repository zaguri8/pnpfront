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

/*
?transaction_uid=56e3265e-418b-426a-91f1-7d34db00e591&
page_request_uid=e56ec875-7710-4166-b612-d6f095086c16&
is_multiple_transaction=false&type=Charge&method=credit-card&number=Dn6pQu&
date=2022-03-13+17%3A28%3A17&status=approved&
status_code=000&status_description=העסקה+בוצעה+בהצלחה
&amount=62&currency=ILS&credit_terms=regular
&number_of_payments=1&secure3D_status=false&secure3D_tracking=false&
approval_num=0464313&card_foreign=0&
voucher_num=63-001-040&
more_info=test1554423&add_data=&
customer_uid=3d0afb1d-9dbb-4b66-a3cf-c5007c1bc9d3&
customer_email=sample%40domain.com&company_name=Wiggit&company_registration_number=308514&terminal_uid=1c74d360-342c-4dfc-8ab3-02bc217592b6&terminal_name=pickNpool&terminal_merchant_number=7143808014&cashier_uid=598f424c-b3aa-44c7-904d-de5e4b835d4c&cashier_name=ראשית&four_digits=6393&expiry_month=09&expiry_year=26&alternative_method=false&customer_name=General+Customer+-+לקוח+כללי&customer_name_invoice=Nadav+Avnon&identification_number=206972432&clearing_id=3&brand_id=3&issuer_id=2&extra_3=&card_holder_name=Nadav+Avnon&card_bin=458016&clearing_name=visacal&brand_name=visa&issuer_name=visacal&token_uid=6dd516f6-4ede-481a-bbf7-d115ac3201a26393
*/



export type TransactionSuccess = {
    transactionProduct: string
    transactionTotalAmount: string
    transactionTotalPrice: string
    transactionDate: string
    status_description: string
    transactionId: string
}

export type TransactionFailure = {
    transactionProduct: string
    transactionTotalAmount: string
    transactionTotalPrice: string
    transactionDate: string
    status_description: string
    transactionId: string
}