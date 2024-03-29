import { useEffect, useState } from 'react'
import { useUser } from '../../context/Firebase'
import { useLoading } from '../../context/Loading'
import { v4 } from 'uuid'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import coins from '../../assets/images/myaccount/coins.png'
import spoil from '../../assets/images/myaccount/spoil-black.png'
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import userIcon from '../../assets/images/appmenu/pink/user.svg'
import listIcon from '../../assets/images/appmenu/pink/list.svg'

import { LOGOUT, MY_ACCOUNT, MY_ACCOUNT_ITEM_1, MY_ACCOUNT_ITEM_2, MY_COINS, SIDE } from '../../settings/strings'
import { ORANGE_GRADIENT_PRIMARY, SECONDARY_WHITE, PRIMARY_PINK, RED_ROYAL, PRIMARY_ORANGE, PRIMARY_BLACK } from '../../settings/colors'
import { useLanguage } from '../../context/Language'
import { Button, Stack } from '@mui/material'
import { PageHolder } from '../utilityComponents/Holders'
import { submitButton } from '../../settings/styles'
import { useNavigate } from 'react-router'
import './MyPayments.css'
import SectionTitle from '../other/SectionTitle';
import { useHeaderBackgroundExtension } from '../../context/HeaderContext'
import { StoreSingleton } from '../../store/external';

const logOutStyle = (width, any = {}) => ({
    color: 'white',
    margin: '16px',
    width: width,
    fontSize: '16px',
    background: RED_ROYAL,
    fontFamily: 'Open Sans Hebrew', ...any
})
const MyPayments = () => {
    const { firebase, user, appUser, signOut } = useUser()
    const { doLoad, cancelLoad, openDialog, closeDialog } = useLoading()
    const nav = useNavigate()
    const { lang } = useLanguage()
    const [transactions, setTransactions] = useState()
    const { hideHeader, showHeader } = useHeaderBackgroundExtension()


    useEffect(() => {
        hideHeader()
        return () => showHeader();
    }, [])


    useEffect(() => {
        let unsub = null, unsub2 = null;
        if (appUser) {
            doLoad()
            unsub = StoreSingleton.get().realTime.getAllTransactions(appUser.customerId, (trans) => {
                unsub2 = StoreSingleton.get().realTime.addListenertoRidesForDates(trans, (transformed) => {
                    setTransactions(transformed)
                    cancelLoad()
                }, (err) => {
                    cancelLoad()
                    if (err)
                        nav('/');
                })
            }, (e) => {
                StoreSingleton.get().realTime.addError({
                    type: 'getAllTransactions',
                    error: '',
                    date: new Date().toISOString(),
                    errorId: '',
                    extraData: e
                })
                cancelLoad()
            })
        }
        return () => { unsub && unsub(); unsub2 && unsub2(); }
    }, [appUser])


    const TransactionRow = ({ transaction, index }) => {
        return (transaction ? <li className='account_transactions_row' dir={SIDE(lang)}>
            <div className='account_transactions_right'>

                <Stack direction={'row'} alignItems={'center'}>
                    <div className='c_square' />
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>{transaction.more_info.productName}</div>
                </Stack>
                <Stack direction={'row'}>

                    <LocationOnIcon style={{ width: '12.5px', height: '12.5px', color: PRIMARY_ORANGE, paddingInline: '8px', }} />
                    <div style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{transaction.more_info.startPoint}</div>

                </Stack>

                <Stack direction={'row'}>

                    <CalendarTodayIcon style={{ width: '12.5px', height: '12.5px', paddingInline: '8px', color: PRIMARY_ORANGE }} />
                    <div style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>{transaction.more_info.eventDate}</div>
                </Stack>
            </div>
            <div style={{ fontSize: '10px', maxWidth: '120px', textAlign: 'center' }}>
                <Button

                    onClick={() => nav('/payment/success', { state: transaction })}
                    style={{ ...submitButton(false), ...{ textTransform: 'none', width: '100%', paddingLeft: '4px', paddingRight: '4px', fontSize: '12px' } }}>{lang === 'heb' ? 'הצג פירוט וברקוד' : 'Show details & Barcode'}</Button>
            </div>

        </li> : null)
    }

    const signOutDialog = () => {
        openDialog({
            content: <Stack>
                <span
                    dir={SIDE(lang)}
                    style={{
                        padding: '8px',
                        fontWeight: 'bold',
                        color: PRIMARY_PINK
                    }}>{lang === 'heb' ? 'האם ברצונך להתנתק מחשבון זה ?' : 'Would you like to log out of this account : '}</span>
                <span
                    dir={SIDE(lang)}
                    style={{
                        padding: '8px',

                        color: PRIMARY_PINK
                    }}>{appUser.email}</span>
                <Button style={logOutStyle('50%', { alignSelf: 'center', background: PRIMARY_PINK })} onClick={() => {
                    closeDialog()
                    alert('התנתקת בהצלחה.')
                    signOut()
                    nav('/')
                }} >
                    {LOGOUT(lang)}
                </Button>
            </Stack>
        })
    }


    return (<PageHolder
        style={{ width: '100%' }}>
        <div className='account_page_top_bar_wrapper'>
            <div className='account_page_top_bar' dir={SIDE(lang)}>
                <div className='account_page_bar_item_big'>
                    <img src={userIcon} />
                    <span>{appUser?.name && appUser.name}</span>
                </div>

                <div className='left'>
                    <div className='account_page_bar_item_small' onClick={signOutDialog}>
                        <LogoutIcon style={{ width: '20px', height: '20px', color: PRIMARY_PINK }} />
                        <span>{LOGOUT(lang)}</span>
                    </div>

                    <div className='account_page_bar_item_small'>
                        <SettingsIcon style={{ width: '20px', height: '20px', color: PRIMARY_PINK }} />
                        <span>{lang === 'heb' ? 'הגדרות' : 'Settings'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='account_page_coupons_bar_wrapper' dir={SIDE(lang)}>

            <div className='account_page_coins_bar'>
                <img src={coins} />
                <span>{MY_ACCOUNT_ITEM_1(lang) + ": " + appUser.coins}</span>
            </div>

            <div className='account_page_coupons_bar'>
                <CardGiftcardIcon style={{ width: '15px', height: '15px', color: 'black', paddingLeft: '8px' }} />
                <span>{MY_ACCOUNT_ITEM_2(lang)}</span>
            </div>
        </div>
        <div style={{ width: '100%', marginRight: '32px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} dir={SIDE(lang)}>
            <img src={listIcon} style={{ width: '15px', height: '15px', paddingLeft: '8px' }} />
            <h3 style={{ color: 'white', textAlign: lang === 'heb' ? 'right' : 'left' }}>{lang === 'heb' ? 'היסטוריית נסיעות' : 'Ride history'}</h3>

        </div>
        {transactions && transactions.length > 0 ? <ul id={'transactions_table'}>

            {transactions.map((trans, index) => <TransactionRow key={v4()} transaction={trans} index={index} />)}
        </ul> : lang === 'heb' ? <h3 style={{ color: PRIMARY_PINK }}>{'אין נסיעות'}</h3> : <h3 style={{ color: PRIMARY_PINK }} >{'No rides'}</h3>}
    </PageHolder>)
}
export default MyPayments