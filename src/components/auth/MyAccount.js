import { LOGOUT, MY_ACCOUNT, MY_ACCOUNT_ITEM_1, MY_ACCOUNT_ITEM_2, MY_ACCOUNT_ITEM_3, MY_ACCOUNT_ITEM_4, SIDE } from "../../settings/strings"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
import { useLanguage } from "../../context/Language"
import { Box, Button } from "@mui/material"
import $ from 'jquery'
import { ORANGE_GRADIENT_PRIMARY } from "../../settings/colors"

import { useEffect } from "react"
import { useFirebase } from "../../context/Firebase"


function MyAccountItem({ title }) {
    return (<Box sx={{ boxShadow: 2, borderRadius: '12.5px' }}><Button className='my_account_item' sx={
        {
            backgroundImage: ORANGE_GRADIENT_PRIMARY,
            borderRadius: '12.5px',
            height: '100px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 5px 0px',
            fontFamily: 'Open Sans Hebrew',
            lineHeight: 'normal',
            width: '100px',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            color: 'white',
            padding: '0px',
            fontSize: '16px'
        }

    }>{title}</Button></Box>)
}


export default function MyAccount() {
    const { lang } = useLanguage()
    const { signOut } = useFirebase()
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

        <Button onClick={() => signOut()} style={{
            color: 'white',
            margin: '16px',
            fontSize: '16px',
            fontFamily: 'Open Sans Hebrew'
        }}>{LOGOUT(lang)}</Button>
    </PageHolder>)
}