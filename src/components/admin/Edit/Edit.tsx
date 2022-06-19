import { Checkbox, Stack, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFirebase } from '../../../context/Firebase'
import { useLoading } from '../../../context/Loading'
import { BLACK_ELEGANT, DARK_BLACK, PRIMARY_BLACK, SECONDARY_WHITE } from '../../../settings/colors'
import { RegisterFormExtras } from '../../../store/external/types'

import SectionTitle from '../../SectionTitle'
import { InnerPageHolder, PageHolder } from '../../utilities/Holders'
import { buttonStyle, checkBoxStyle } from '../InvitationStatistics'
import './Edit.css'
export default function Edit() {


    const { firebase } = useFirebase()
    const { doLoad, cancelLoad } = useLoading()
    const [registerSettings, setRegisterSettings] = useState<RegisterFormExtras | undefined>()
    const [hasChanges, setHasChanges] = useState<{ [id: string]: boolean }>({})

    useEffect(() => {
        doLoad()
        const unsub = firebase.realTime.addListenerToRegistrationPage((settings) => {
            cancelLoad()

            setRegisterSettings(settings)
        }, () => cancelLoad())
        return () => unsub()
    }, [])


    const updateRegistrationBirthDateRequired = (req: boolean) => {
        if (registerSettings) {
            setRegisterSettings({
                ...registerSettings,
                requireBirthDate: req
            })
            setHasChanges({ ...hasChanges, requireBirthDate: true })
        }
    }
    const executeRegistrationUpdate = () => {
        if (registerSettings) {
            doLoad()
            firebase.realTime.updateWebsiteRegistrationPage(registerSettings)
                .then(() => {
                    alert('ערכת בהצלחה את דף ההרשמה')
                    cancelLoad()
                }).catch(e => {
                    alert('אירעתה שגיאה בעת עריכת הדף, אנא פנא למתנכת האתר')
                    cancelLoad()
                })
        }
    }

    const labelStyle = {
        color: SECONDARY_WHITE
    }
    const cbStyle = {
        color: SECONDARY_WHITE
    }
    return <PageHolder style={{
        background: PRIMARY_BLACK,
        overflowX: 'hidden'
    }} >

        <SectionTitle title={'עריכת אתר'} style={{}} />
        <InnerPageHolder
            style={{ background: BLACK_ELEGANT }}>

            <h2 style={labelStyle}>{'דף הרשמה'}</h2>
            {registerSettings && <Stack alignItems={'center'}>

                <Stack direction={'row'} alignItems={'center'}>

                    <label style={labelStyle}>
                        דרוש תאריך לידה
                    </label>
                    <Checkbox checked={registerSettings.requireBirthDate} style={checkBoxStyle} onChange={(e) => {
                        const checked = e.target.checked
                        updateRegistrationBirthDateRequired(checked)
                    }} />
                </Stack>
                <Button onClick={executeRegistrationUpdate} disabled={!hasChanges['requireBirthDate']}
                    style={{
                        ...buttonStyle, ...{
                            background: hasChanges['requireBirthDate'] ? DARK_BLACK : 'gray'
                        }
                    }}>
                    שמור דף הרשמה
                </Button>
            </Stack>}

        </InnerPageHolder>

    </PageHolder>
}