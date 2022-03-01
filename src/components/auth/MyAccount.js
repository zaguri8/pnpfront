import { LOGOUT, MY_ACCOUNT, MY_ACCOUNT_ITEM_1, MY_ACCOUNT_ITEM_2, MY_ACCOUNT_ITEM_3, MY_ACCOUNT_ITEM_4, SIDE } from "../../settings/strings"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import { useLanguage } from "../../context/Language"
import { Button } from "@mui/material"
import $ from 'jquery'
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"

import { useEffect } from "react"
import { useAuthState } from "../../context/Firebase"


function MyAccountItem({ title }) {
    return (<Button className='my_account_item' sx={
        {
            backgroundImage: ORANGE_GRADIENT_PRIMARY,
            borderRadius: '12.5px',
            height: '100px',
            fontFamily: 'Open Sans Hebrew',
            lineHeight: 'normal',
            width: '100px',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            color: 'white',
            padding: '0px',
            fontSize: '16px'
        }

    }>{title}</Button>)
}


export default function MyAccount() {
    const { lang } = useLanguage()
    const { firebase } = useAuthState()
    useEffect(() => {
        function resize() {
            const currentWidth = window.innerWidth
            if (currentWidth > 628) {
                $('.my_account_item').css('width', '200px')
            } else {
                $('.my_account_item').css('width', '100px')
            }
        }
        $(window).resize(() => { resize() })
        resize()
    }, [])
    return (<PageHolder>
        <SectionTitle title={MY_ACCOUNT(lang)} style={{}} />
        <InnerPageHolder  >
            <div dir={SIDE(lang)} id='my_account_grid' style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gridTemplateColumns: '1fr 1fr',

                gap: '4vw 6vw'
            }}>

                <MyAccountItem title={MY_ACCOUNT_ITEM_1(lang)} />
                <MyAccountItem title={MY_ACCOUNT_ITEM_2(lang)} />



                <MyAccountItem title={MY_ACCOUNT_ITEM_3(lang)} />
                <MyAccountItem title={MY_ACCOUNT_ITEM_4(lang)} />

            </div>
        </InnerPageHolder>

        <Button onClick={() => firebase.auth.signOut()} style={{
            color: 'white',
            margin: '16px',
            fontSize: '16px',
            fontFamily: 'Open Sans Hebrew'
        }}>{LOGOUT(lang)}</Button>
    </PageHolder>)
}