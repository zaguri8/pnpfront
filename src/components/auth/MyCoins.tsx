import { Stack, Typography } from "@mui/material";
import { BLACK_ELEGANT, BLACK_ROYAL, DARKER_BLACK_SELECTED, DARK_BLACK, ORANGE_GRADIENT_PRIMARY, PRIMARY_BLACK, SECONDARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
import { MY_COINS, SIDE } from "../../settings/strings";
import { elegantShadow } from "../../settings/styles";
import { Hooks } from "../generics/types";
import { withHookGroup } from "../generics/withHooks";
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders";

function MyCoins(props:Hooks) {



    const textStyle = {
        fontSize: '32px',
        color: SECONDARY_WHITE,
        fontWeight: 'bold',
        fontFamily: 'Open Sans Hebrew'
    }

    const triangle = {
        borderLeft: '50px solid transparent',
        borderRight: '50px solid transparent',
        borderTop: '50px solid black',
        height: 0,
        width: 0,
        background: 'transparent'
    }

    const coin = {
        width: '10px',
        height: '10px',
        color: SECONDARY_WHITE,
        transition: '.1s linear',
        transform: 'translateX(60%) translateY(50%)'
    }
    const coinWrapper = {
        width: '20px',
        height: '20px',
        transform: 'translateX(50%) translateY(20%)',

        borderRadius: '10px'
    }

    const coinWrapper2 = {
        background: DARKER_BLACK_SELECTED,
        width: '40px',
        height: '40px',

        transform: 'translateX(25.5%) translateY(30%)',
        borderRadius: '20px'
    }
    const coinWrapper3 = {
        background: BLACK_ELEGANT,
        width: '60px',
        border: '1px solid whitesmoke',
        height: '60px',
        transform: 'translateX(15%) translateY(15%)',
        borderRadius: '30px'
    }

    const coinWrapper4 = {
        background: '#282c34',
        boxShadow: elegantShadow(),
        width: '80px',

        border: '1px solid white',
        height: '80px',
        borderRadius: '40px'
    }


    const planeRotation = 'rotateX(calc(var(--rotate-x, -24) * 1deg))' +
        ' rotateY(calc(var(--rotate-y, -24) * 1deg))' + ' rotateX(240deg) translate3d(0, 0, 0)'
    const coinStackStyle = {
        padding: '8px',
        width: '50%',
        borderRadius: '8px',
        borderbottom: '50px solid red',
        margin: '16px',
    }
    const coinStackStyleOuter = {
        padding: '8px',
        width: '100%',
        borderRadius: '8px',

        margin: '16px',
    }
    const coinTextStyle = {
        fontSize: '24px'
    }
    return <PageHolder>
        <InnerPageHolder style={{ background: 'none', border: 'none' }}>


            <Stack alignItems={'center'} style={coinStackStyleOuter}>
                <Typography
                    dir={SIDE(props.language.lang)}
                    style={textStyle}>
                    {MY_COINS(props.language.lang)}
                </Typography>

                <Stack direction='row' style={coinStackStyle}

                    justifyContent={'center'} spacing={3}>

                    <div style={coinWrapper4}>
                        <div style={coinWrapper3}>
                            <div style={coinWrapper2}>
                                <div style={coinWrapper}>
                                    <div
                                        style={coin}
                                    >


                                        <Typography
                                            style={coinTextStyle}
                                            color='white'>
                                            {props.user.appUser && props.user.appUser.coins}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Stack>

            </Stack>
        </InnerPageHolder>
    </PageHolder>
}

export default withHookGroup(MyCoins,['language','user'])