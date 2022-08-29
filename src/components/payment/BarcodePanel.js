import { get, ref } from 'firebase/database'
import { useState } from 'react'
import { useLoading } from '../../context/Loading'
import { StoreSingleton } from '../../store/external'
const BarcodePanel = () => {
    const [barcode, setBarCode] = useState()
    const [transaction, setTransaction] = useState()
    const { doLoad, cancelLoad } = useLoading()

    const handleBarcodeCheck = async () => {
        doLoad()
        barcode && await get(ref(StoreSingleton.getTools().db, `transactions/ridePurchases`))
            .then(data => {
                const failures = data.child('error')
                const success = data.child('success')
                failures.forEach(child => {
                    child.forEach(innerChild => {
                        const transaction = transactionFromDict(innerChild)
                        if (transaction.child('id').val() === barcode) {
                            return transaction
                        }
                    })
                })
                success.forEach(child => {
                    child.forEach(innerChild => {
                        const transaction = transactionFromDict(innerChild)
                        if (transaction.child('id').val() === barcode) {
                            return transaction
                        }
                    })
                })
                return null
            }).then(transaction => {
                if (transaction)
                    setTransaction(transaction)
                cancelLoad()
            }).catch(cancelLoad)
    }
    return <div><input onChange={(e) => setBarCode(e.target.value)} placeholder='הכנס ברקוד' type={'text'}>

    </input><button onClick={handleBarcodeCheck()}>Search Barcode</button> {(transaction ? <tr style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke', color: 'black', display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', padding: '8px' }}>
        <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{new Date(transaction.date).toDateString()}</td>
        <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.name}</td>
        <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.price}</td>
        <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{transaction.product.amount}</td>
        <td style={{ fontSize: '12px', padding: '8px', marginTop: 'auto', marginBottom: 'auto' }}>{Number(transaction.product.amount) * Number(transaction.product.price)}</td>
        <td style={{ fontSize: '12px', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', color: transaction.results && transaction.results.status === 'error' ? 'red' : 'green' }}>{transaction.results.status === 'error' ? 'Failed' : 'Success'}</td>
    </tr> : null)}</div>
}
export default BarcodePanel