import { child, get, ref } from 'firebase/database'
import { useEffect, useLayoutEffect, useState } from 'react'
import { transactionFailureFromDict, transactionSuccessFromDict } from '../../store/payments/converters'
import { useFirebase } from '../../context/Firebase'
import $ from 'jquery'
import axios from 'axios'
import { useLoading } from '../../context/Loading'
import { v4 } from 'uuid'
const MyPayments = () => {
    const { freeDbRef, user, appUser } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [transactions, setTransactions] = useState()
    useEffect(() => {
        if (user && appUser) {
            doLoad()
            axios.post('https://nadavsolutions.com/gserver/transactions', { uid: appUser.customerId }, { headers: { 'Content-Type': 'application/json' } })
                .then(response => {

                    const send = response.data.map(trans => ({
                        transactionDate: trans.transaction.date,
                        transactionProduct: trans.transaction.more_info,
                        transactionTotalAmount: 1,
                        transactionId: trans.transaction_uid,
                        transactionTotalPrice: trans.transaction.amount,
                        status_description: trans.transaction.status_code === '000' ? 'Success' : 'Failure'
                    }))

                    setTransactions(send)
                    cancelLoad()
                }).catch(e => {
                    cancelLoad()
                })
        }
    }, [])

    const TransactionRow = ({ transaction, index }) => {
        return (transaction ? <tr style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke', color: 'black', display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px' }}>
            <td style={{ margin: '2px', width: '50px', fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{new Date(transaction.transactionDate).toDateString()}</td>
            <td style={{ margin: '2px', width: '100px', fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.transactionProduct}</td>
            <td style={{ margin: '2px', width: '50px', fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.transactionTotalAmount}</td>
            <td style={{ margin: '2px', width: '50px', fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.transactionTotalPrice}</td>
            <td style={{ margin: '2px', width: '100px', fontSize: '12px', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', color: transaction.status_description === 'Success' ? 'green' : 'red' }}>{transaction.status_description === 'העסקה בוצעה בהצלחה' ? 'Failed' : 'Success'}</td>
        </tr> : null)
    }



    return (<table style={{ width: '80%', overflow: 'scroll', minWidth: '100%', alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '32px', width: '50%', display: 'grid', columnGap: '16px', gridTemplateRows: `repeat(transactions.length,1fr)` }} id={'transactions_table'}>

        <tbody id='table_transactions_content'>
            <tr style={{ background: 'orange', height: 'fit-content', color: 'white', display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px' }}>
                <th style={{ width: '100px', marginLeft: '4px', marginRight: '4px', fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Date</th>
                <th style={{ width: '100px', marginLeft: '4px', marginRight: '4px', fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Product</th>
                <th style={{ width: '100px', marginLeft: '4px', marginRight: '4px', fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Amount</th>
                <th style={{ width: '100px', marginLeft: '4px', marginRight: '4px', fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Total</th>
                <th style={{ width: '100px', marginLeft: '4px', marginRight: '4px', fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Status</th>
            </tr>
            {transactions && (transactions.length > 0 ? transactions.map((trans, index) => <TransactionRow key={v4()} transaction={trans} index={index} />) : <h1>No Transactions</h1>)}
        </tbody>
    </table>)
}
export default MyPayments