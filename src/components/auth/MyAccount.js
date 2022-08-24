import { LOGOUT, MY_ACCOUNT, MY_ACCOUNT_ITEM_1, MY_ACCOUNT_ITEM_2, MY_ACCOUNT_ITEM_3, MY_ACCOUNT_ITEM_4, MY_COINS, SIDE } from "../../settings/strings"
import SectionTitle from "../other/SectionTitle"
import spoil from '../../assets/images/myaccount/spoil-black.png'
import settings from '../../assets/images/myaccount/settings.png'
import coins from '../../assets/images/myaccount/coins.png'
import ridehistory from '../../assets/images/myaccount/historyRides.png'
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders"
import '../saynomore/SayNoMoreItem.css'
import { useLanguage } from "../../context/Language"
import { Button, Stack } from "@mui/material"
import bus from '../../assets/images/bus.png'
import $ from 'jquery'
import { BLACK_ELEGANT, BLACK_ROYAL, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, RED_ROYAL, SECONDARY_WHITE } from "../../settings/colors"

import { useEffect, useState } from "react"
import { useFirebase } from "../../context/Firebase"

import { useNavigate } from 'react-router'
import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import Spacer from "../utilityComponents/Spacer"
import { useLoading } from "../../context/Loading"
import MyCoins from "./MyCoins"
import { useHeaderBackgroundExtension } from "../../context/HeaderContext"
function MyAccountItem({ title, icon, navTo, underCons }) {
    const nav = useNavigate()
    const { openUnderConstruction } = useLoading()
    const { lang } = useLanguage()
    return (<Button onClick={() => underCons ? openUnderConstruction(lang) : nav(navTo)} className='my_account_item' sx={{
        backgroundImage: DARK_BLACK,
        borderRadius: '12.5px',
        height: '100px',
        boxShadow: ' rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.05) 0px 4px 2px, rgba(0, 0, 0, 0.05) 0px 8px 4px, rgba(0, 0, 0, 0.05) 0px 16px 8px, rgba(0, 0, 0, 0.05) 0px 32px 16px',
        fontFamily: 'Open Sans Hebrew',
        lineHeight: 'normal',
        width: '100px',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        color: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '0px',
        fontSize: '16px'
    }}><span className='my_account_item_text' style={
        {
            fontFamily: 'Open Sans Hebrew',
            background: 'none',
            height: '50%',
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            lineHeight: 'normal'
        }
    } >{title}</span><img style={{ width: '25px', height: '25px' }} src={icon}></img></Button>)
}


export default function MyAccount() {
    const { lang } = useLanguage()
    const { signOut, appUser } = useFirebase()
    const { openDialog, closeDialog } = useLoading()

    useEffect(() => {
        function resize() {
            const currentWidth = window.innerWidth
            if (currentWidth > 720) {
                $('.my_account_item').css({ 'width': '125px', height: '110px', transition: '.3125s linear' })
                $('.my_account_item_text').css({ 'width': '100%', transition: '.5s linear' })
                setBgSpace('1000px bottom')

            } else {
                $('.my_account_item').css({ 'width': '100px', height: '100px', transition: '.3125s linear' })
                $('.my_account_item_text').css({ 'width': '100%', transition: '.5s linear' })
                setBgSpace('300px bottom')
            }
        }
        window.addEventListener('resize', resize)
        resize()

        return () => { window.removeEventListener('resize', resize) }
    }, [])
    const nav = useNavigate()
    const logOutStyle = (width, any = {}) => ({
        color: 'white',
        margin: '16px',
        width: width,
        fontSize: '16px',
        background: RED_ROYAL,
        fontFamily: 'Open Sans Hebrew', ...any
    })
    const [bgSpace, setBgSpace] = useState('200px bottom')
    return (<PageHolder>

        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />
        <InnerPageHolder style={{

            background: 'none',
            border: 'none'
        }} >
            <div dir={SIDE(lang)} id='my_account_grid' style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gridTemplateColumns: '1fr 1fr',

                gap: '4vw 6vw'
            }}>

                <MyAccountItem underCons={true} navTo={'/'} icon={coins} title={MY_ACCOUNT_ITEM_1(lang)} />
                <MyAccountItem underCons={true} navTo={'/'} icon={'https://img.icons8.com/ios/50/000000/gift--v1.png'} title={MY_ACCOUNT_ITEM_2(lang)} />



                <MyAccountItem navTo={'/myaccount/transactions'} icon={ridehistory} title={MY_ACCOUNT_ITEM_3(lang)} />
                <MyAccountItem underCons={true} navTo={'/'} icon={settings} title={MY_ACCOUNT_ITEM_4(lang)} />

            </div>
        </InnerPageHolder>

        <Button onClick={() => {
            openDialog({
                content: <Stack>
                    <span
                        dir={SIDE(lang)}
                        style={{
                            padding: '8px',
                            color: PRIMARY_BLACK
                        }}>{lang === 'heb' ? 'האם ברצונך להתנתק מחשבון זה ' : 'Would you like to log out of this account : '}</span>
                    <span
                        dir={SIDE(lang)}
                        style={{
                            padding: '8px',
                            color: PRIMARY_BLACK
                        }}>{appUser.email}</span>
                    <Button style={logOutStyle('50%', { alignSelf: 'center' })} onClick={() => {
                        closeDialog()
                        alert('התנתקת בהצלחה.')
                        signOut()
                        nav('/')
                    }} >
                        {LOGOUT(lang)}
                    </Button>
                </Stack>
            })
        }} style={logOutStyle('fit-content')}>{LOGOUT(lang)}</Button>
    </PageHolder>)
}