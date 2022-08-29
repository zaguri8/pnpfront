
import { Button, Stack, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import $ from 'jquery'
import { SECONDARY_WHITE } from '../../../settings/colors'
import { textFieldStyle } from '../../../settings/styles'
import dollar from '../../../assets/images/dollar.png'
import { InnerPageHolder, PageHolder } from '../../utilityComponents/Holders'
import { buttonStyle } from '../InvitationStatistics'
import ServerRequest from '../../../network/serverRequest'
import './GeneratePaymentForm.css'
import { useUser } from '../../../context/Firebase'
import { useLoading } from '../../../context/Loading'
import { useNavigate } from 'react-router'
export default function GeneratePaymentForm() {
    const useStyles = makeStyles(() => textFieldStyle(SECONDARY_WHITE))
    const classes = useStyles()
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const nav = useNavigate()
    const createPaymentPage = () => {
        const customerName = $('#payment_p_1').val() as string
        const productName = $('#payment_p_2').val() as string
        const customerPhone = $('#payment_p_3').val() as string
        const customerEmail = $('#payment_p_4').val() as string
        const totalToPay = $('#payment_p_5').val() as number
        doLoad()

        ServerRequest('generatePrivatePaymentLink',
            {
                customer: {
                    'customer_name': customerName,
                    'email': customerEmail,
                    'phone': customerPhone
                },
                product: {
                    'name': productName,
                    'quantity': 1,
                    'price': totalToPay
                }
            }, (data: any) => {
                cancelLoad()
                if (data.paymentLink) {
                    openDialog({
                        content: <Stack padding={'8px'}>
                            <label style={{ color: SECONDARY_WHITE }}>
                                {'דף תשלום נוצר בהצלחה'}
                            </label>
                            <a onClick={() => {
                                closeDialog()
                            }} href={data.paymentLink} >{data.paymentLink}</a>
                        </Stack>
                    })
                    nav('/')
                } else {
                    alert('אירעתה שגיאה בעת יצירת דף תשלום, אנא  פנא למתכנת')
                }
            }, (error: any) => {
                cancelLoad()
                alert('אירעתה שגיאה בעת יצירת דף תשלום, אנא  פנא למתכנת')
                alert(error)
            })

    }
    return <PageHolder>
        <InnerPageHolder style={{ background: 'none' }}>
            <img className='dollar_payment_icon' src={dollar} />
            <Stack spacing={1}>
                <TextField id='payment_p_1' classes={classes} name='name' dir='rtl' placeholder={
                    'שם לקוח'
                }>
                </TextField>
                <TextField id='payment_p_2' classes={classes} dir='rtl' placeholder={
                    'שם פריט/סיבת תשלום'
                }>
                </TextField>

                <TextField id='payment_p_3' classes={classes} type='tel' name='phone' dir='rtl' placeholder={
                    'טלפון לקוח'
                }>
                </TextField>

                <TextField id='payment_p_4' classes={classes} name='email' dir='rtl' placeholder={
                    'אימייל לקוח'
                }>
                </TextField>

                <TextField id='payment_p_5' type={'number'} InputProps={{ inputProps: { min: 1, max: 25000 } }} autoComplete="off" name='number' classes={classes} dir='rtl' placeholder={
                    'סה"כ לתשלום'
                }>
                </TextField>
                <label className='field_comment'>
                    במקרה ולא צריך מתן אישור במייל/טלפוני ניתן להכניס טלפון,מייל של גובה תשלום במקום פרטי לקוח
                </label>
            </Stack>
            <Button onClick={createPaymentPage} style={{ ...buttonStyle, ...{ marginTop: '16px' } }}>
                צור דף תשלום
            </Button>
        </InnerPageHolder>
    </PageHolder>
}