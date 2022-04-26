import { useEffect, useState } from "react"
import { useFirebase } from "../../context/Firebase"
import { useLoading } from "../../context/Loading"
import { BLACK_ELEGANT, PRIMARY_BLACK, SECONDARY_WHITE } from "../../settings/colors"
import { PNPUser } from "../../store/external/types"
import SectionTitle from "../SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilities/Holders"
    const today = new Date()
export default function UserStatistics() {


    const { doLoad, cancelLoad } = useLoading()
    const { firebase } = useFirebase()

    const [users, setUsers] = useState<PNPUser[] | undefined>()


    const [numOfShowing, setNumOfShowing] = useState(10)
    useEffect(() => {

        doLoad()
        const unsub = firebase.realTime.addListenerToUsers((users) => {
            setUsers(users.filter(u => {
                const dist = Number(today.getFullYear()) - Number(u.birthDate.split('/')[2])
                return dist > 1 && dist < 100
            }))
            cancelLoad()
        }, (e) => {
            cancelLoad()
        })
        return () => unsub()
    }, [])

    return <PageHolder style={{ padding: '0px',scroll:'hidden',background:BLACK_ELEGANT}}>
        <SectionTitle style={{}} title={'ניהול משתמשים - בטא'} />
        <label style=  {{color:SECONDARY_WHITE,padding:'16px'}}>{'מציג: ' + numOfShowing + " משתמשים"}</label>
        <select onChange={(e) => setNumOfShowing(Number(e.target.value))}>

            <option value={10}>
                10
            </option>

            <option value={50}>
                50
            </option>

            <option value={100}>
                100
            </option>

            <option value={250}>
                250
            </option>

            <option value={500}>
                500
            </option>

            <option value={users?.length ?? 'הכל'}>
                {'הכל'}
            </option>
        </select>

        <p dir = 'rtl' style= {{color:SECONDARY_WHITE,fontWeight:'bold',fontSize:'10px'}}>{'בקרוב: הצג לפי.. סנן לפי.. שלח הודעה ל..'}</p>
        <InnerPageHolder style={{maxWidth:'300px',background: 'none',margin:'0px',border:'none'}}>
            {users && <table dir={'rtl'} style={{maxWidth:window.outerWidth < 400 ? '300px':'90%',display:'block',padding: '4px', fontSize: '12px', background: SECONDARY_WHITE, color: PRIMARY_BLACK, overflow: 'scroll' }}><thead><tr><th style={{ fontSize: '14px', textDecoration: 'underline' }}>{'שם'}</th><th style={{ fontSize: '14px', textDecoration: 'underline' }}>{'גיל'}</th><th style={{ fontSize: '14px', textDecoration: 'underline' }}>{'אימייל'}</th><th style={{ fontSize: '14px', textDecoration: 'underline' }}>{'טלפון'}</th></tr></thead><tbody >{users.slice(0, numOfShowing).map(user => {
                return <tr key={user.email + user.name}><th>{user.name}</th><th>{Number(today.getFullYear()) - Number(user.birthDate.split('/')[2])}</th><th >{user.email}</th><th >{user.phone}</th></tr>
            })}</tbody></table>}
        </InnerPageHolder></PageHolder>
}