import { child, get, ref } from 'firebase/database'
import { useEffect, useLayoutEffect, useState } from 'react'
import { transactionFromDict } from '../../store/payments/converters'
import { useFirebase } from '../../context/Firebase'
import $ from 'jquery'
import { useLoading } from '../../context/Loading'
import { v4 } from 'uuid'
const MyPayments = () => {
    const { freeDbRef, user } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [transactions, setTransactions] = useState()
    useEffect(() => {
        doLoad()
        user ? get(ref(freeDbRef, `transactions/ridePurchases`))
            .then(data => {
                const failures = data.child('failure').child(user.uid)
                const success = data.child('success').child(user.uid)
                const all = []
                failures.forEach((child) => {
                    all.push(transactionFromDict(child))
                })

                success.forEach((child) => {
                    all.push(transactionFromDict(child))
                })
                console.log(all)
                setTransactions(all)
                cancelLoad()
            }).catch(() => cancelLoad()) : cancelLoad()
    }, [])

    const TransactionRow = ({ transaction, index }) => {
        return (transaction ? <tr style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke', color: 'black', display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px' }}>
            <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{new Date(transaction.date).toDateString()}</td>
            <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.name}</td>
            <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.price}</td>
            <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.amount}</td>
            {/* {transaction.data && transaction.data.data && transaction.data.data.items && transaction.data.data.items.length > 0 && <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.data.data.items[0].product_uid}</td>} */}
            <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{Number(transaction.product.amount) * Number(transaction.product.price)}</td>
            <td style={{ fontSize: '12px', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', color: transaction.results && transaction.results.status === 'error' ? 'red' : 'green' }}>{transaction.results.status === 'error' ? 'Failed' : 'Success'}</td>
        </tr> : null)
    }



    return (<table style={{ width: '80%', overflow: 'scroll', minWidth: '100%', alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '32px', width: '50%', display: 'grid', columnGap: '16px', gridTemplateRows: `repeat(transactions.length,1fr)` }} id={'transactions_table'}>

        <tbody id='table_transactions_content'>
            <tr style={{ background: 'orange', color: 'white', display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px' }}>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Date</th>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Product name</th>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Price per unit</th>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Product amount</th>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Total transaction payment</th>
                <th style={{ fontSize: '12px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Transaction Status</th>
            </tr>
            {transactions && (transactions.length > 0 ? transactions.map((trans, index) => <TransactionRow key={trans ? (trans.product.name + index + trans.product.amount) : v4()} transaction={trans} index={index} />) : <h1>No Transactions</h1>)}
        </tbody>
    </table>)
}
export default MyPayments