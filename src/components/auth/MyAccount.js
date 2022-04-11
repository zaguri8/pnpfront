import { LOGOUT, MY_ACCOUNT, MY_ACCOUNT_ITEM_1, MY_ACCOUNT_ITEM_2, MY_ACCOUNT_ITEM_3, MY_ACCOUNT_ITEM_4, SIDE } from "../../settings/strings"
import SectionTitle from "../SectionTitle"
import spoil from '../../assets/images/myaccount/spoil-black.png'
import settings from '../../assets/images/myaccount/settings.png'
import coins from '../../assets/images/myaccount/coins.png'
import ridehistory from '../../assets/images/myaccount/historyRides.png'
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import '../saynomore/SayNoMoreItem.css'
import { useLanguage } from "../../context/Language"
import { Button } from "@mui/material"
import $ from 'jquery'
import { DARK_BLACK, ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"

import { useEffect } from "react"
import { useFirebase } from "../../context/Firebase"

import { useNavigate } from 'react-router'
import SayNoMoreContainer from "../saynomore/SayNoMoreContainer"
import Spacer from "../utilities/Spacer"
function MyAccountItem({ title, icon, navTo }) {
    const nav = useNavigate()
    return (<Button onClick={() => nav(navTo)} className='my_account_item' sx={{
        backgroundImage: DARK_BLACK,
        borderRadius: '12.5px',
        height: '100px',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 2px 5px 0px',
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
    const { signOut } = useFirebase()
    useEffect(() => {
        function resize() {
            const currentWidth = window.innerWidth
            if (currentWidth > 720) {
                $('.my_account_item').css('width', '150px')
                $('.my_account_item_text').css('width', '50%')

            } else {
                $('.my_account_item').css('width', '100px')
                $('.my_account_item_text').css('width', '100%')
            }
        }
        window.addEventListener('resize', resize)
        resize()

        return () => { window.removeEventListener('resize', resize) }
    }, [])
    return (<PageHolder>

        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />

        <InnerPageHolder style = {{background:'rgb(40,38,55,1)'}} >
            <div dir={SIDE(lang)} id='my_account_grid' style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gridTemplateColumns: '1fr 1fr',

                gap: '4vw 6vw'
            }}>

                <MyAccountItem navTo={'/'} icon={coins} title={MY_ACCOUNT_ITEM_1(lang)} />
                <MyAccountItem navTo={'/'} icon={'https://img.icons8.com/ios/50/000000/gift--v1.png'} title={MY_ACCOUNT_ITEM_2(lang)} />



                <MyAccountItem navTo={'/myaccount/transactions'} icon={ridehistory} title={MY_ACCOUNT_ITEM_3(lang)} />
                <MyAccountItem navTo={'/'} icon={settings} title={MY_ACCOUNT_ITEM_4(lang)} />

            </div>
        </InnerPageHolder>

        <Button onClick={() => signOut()} style={{
            color: 'white',
            margin: '16px',
            fontSize: '16px',
            fontFamily: 'Open Sans Hebrew'
        }}>{LOGOUT(lang)}</Button>
    </PageHolder>)
}