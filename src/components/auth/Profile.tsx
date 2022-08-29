
import { SECONDARY_WHITE } from '../../settings/colors'
import { innerShadow } from '../../settings/styles'
import EditIcon from '@mui/icons-material/Edit';
import { useLanguage } from '../../context/Language'
import './Profile.css'
import { HELLO, SIDE } from '../../settings/strings'
import { MenuItem, Stack } from '@mui/material'
import { useState } from 'react'
import { v4 } from 'uuid'
import { Hooks } from '../generics/types';
import { withHookGroup } from '../generics/withHooks';

enum ProfileSubPage {
    coupons, edit, settings, history
}

interface IProfileButton {
    title: string
    action: () => void
}

interface IProfileActionToolbar {
    profileMenuItems: IProfileButton[],
}

function ProfileActionToolbar(props: IProfileActionToolbar) {
    const { lang } = useLanguage()
    return (<div
        dir={SIDE(lang)}
        style={{
            ...{
                justifyContent: 'center',

            }

        }}>
        <div
            id='toolbar_profile_buttons'
            dir={SIDE(lang)}>
            {props.profileMenuItems.map(b =>
                <MenuItem
                    key={v4()}
                    onClick={b.action}

                    id='button_profile'>
                    {b.title}
                </MenuItem>)}
        </div>
    </div >);
}


function Profile(props: Hooks) {
    const [showingProfilePage, setShowingProfilePage] = useState<ProfileSubPage>(ProfileSubPage.settings)


    const profileMenuItems: IProfileButton[] = [
        { title: props.language.lang === 'heb' ? 'קופונים' : 'Coupons', action: () => { setShowingProfilePage(ProfileSubPage.coupons) } },
        { title: props.language.lang === 'heb' ? 'הגדרות' : 'Settings', action: () => { setShowingProfilePage(ProfileSubPage.settings) } },
        { title: props.language.lang === 'heb' ? 'הפעילות שלי' : 'My Activity', action: () => { setShowingProfilePage(ProfileSubPage.history) } },
    ]


    function determineProfileSubPage() {
        switch (showingProfilePage) {
            case ProfileSubPage.coupons:
                return <div>1</div>
            case ProfileSubPage.settings:
                return <div>2</div>
            case ProfileSubPage.edit:
                return <div>3</div>
            case ProfileSubPage.history:
                return <div>4</div>
        }
    }


    return (props.user.appUser ? <div id='container_profile'>


        <div

            id='profile_holder'
        >

            <div id='rounded_effect'>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        style={{
                            width: '142px', height: '142px',
                            background: `url('https://media-exp1.licdn.com/dms/image/C4D03AQFRX5hDlKb9tQ/profile-displayphoto-shrink_200_200/0/1613519792334?e=1652918400&v=beta&t=dT5ti8l7Ps4TwH5bNP9VIPut46zq_GYoNA1QdxtYwRI')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: 'transparent',
                            backgroundSize: 'cover',
                            boxShadow: innerShadow,
                            backgroundPosition: 'center center',
                            borderRadius: '50%',
                            border: '.1px solid white'
                        }}
                    >

                    </div>
                    <Stack direction={'row'}
                        alignItems={'center'} style={{ cursor: 'pointer' }}>
                        <EditIcon style={{ color: SECONDARY_WHITE, padding: '4px', marginLeft: 'auto', marginRight: 'auto' }} />
                        <span style={{ color: SECONDARY_WHITE }}>{props.language.lang === 'heb' ? 'שנה תמונה' : 'Edit image'}</span>
                    </Stack>
                </div>
                <div>

                    <h5
                        style={
                            {
                                textAlign: 'right',

                                margin: '4px',
                                color: SECONDARY_WHITE
                            }
                        }
                    >{',' + HELLO(props.language.lang)}</h5>
                    <h3 style={
                        {
                            margin: '0px',
                            padding: '0px',
                            color: SECONDARY_WHITE
                        }
                    }>{props.user.appUser.name}</h3>
                </div>

            </div>
        </div>
        <ProfileActionToolbar

            profileMenuItems={profileMenuItems}></ProfileActionToolbar>
        <div
            id='showing_page'
        >
            {determineProfileSubPage()}
        </div>


    </div> : null)
}
export default withHookGroup(Profile, ['user', 'language'])