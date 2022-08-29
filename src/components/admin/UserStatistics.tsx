import { useEffect, useState } from "react"
import { BLACK_ELEGANT, SECONDARY_WHITE } from "../../settings/colors"
import { StoreSingleton } from "../../store/external"
import { PNPUser } from "../../store/external/types"
import { Hooks } from "../generics/types"
import { CommonHooks, withHookGroup } from "../generics/withHooks"
import SectionTitle from "../other/SectionTitle"
import { InnerPageHolder, PageHolder } from "../utilityComponents/Holders"
const today = new Date()
import './UserStatistics.css'
function UserStatistics(props: Hooks) {
    const [users, setUsers] = useState<PNPUser[] | undefined>()
    const [usersCopy, setUsersCopy] = useState<PNPUser[] | undefined>()
    useEffect(() => {
        props.headerExt.hideHeader()
        return () => props.headerExt.showHeader()
    }, [])

    useEffect(() => {

        props.loading.doLoad()
        const unsub = StoreSingleton.getTools().realTime.addListenerToUsers((users) => {
            users.forEach(u => {
                const dist = Number(today.getFullYear()) - Number(u.birthDate.split('/')[2])
                if (dist <= 1 || dist > 100 || !dist) {
                    u.birthDate = "אין"
                } else {
                    u.birthDate = dist + ""
                }
            })
            users.sort((user1, user2) => user1.birthDate === 'אין' ? 1 : user2.birthDate === 'אין' ? -1 : (Number(user1.birthDate) - Number(user2.birthDate)))
            setUsers(users)
            setUsersCopy(users)
            props.loading.cancelLoad()
        }, (e) => {
            props.loading.cancelLoad()
        })
        return () => unsub()
    }, [])



    const determineRowStyle = (index: number) => {
        const baseStyle = { height: '50px', color: SECONDARY_WHITE }
        if (index % 2 === 0) {
            return { ...baseStyle, background: '#bd3333' }
        }
        return { ...baseStyle, background: 'black' }
    }

    const filterUsers = (e: any) => {
        const val = e.target.value
        if (!val) {
            setUsers(usersCopy)
        } else if (users) {
            setUsers(usersCopy?.filter(u => u.name.includes(val) || u.email.includes(val)))
        }
    }

    const filterUsersByAge = (e: any) => {
        const val = e.target.value
        if (!val || Number(val) === 0) {
            setUsers(usersCopy)
        } else if (usersCopy) {
            const age = Number(val)
            let filter: any = null
            switch (age) {
                case 17:
                    filter = usersCopy.filter(u => {
                        const bday = Number(u.birthDate)
                        return bday && bday <= 17
                    })
                    break;
                case 18:
                    filter = usersCopy.filter(u => {
                        const bday = Number(u.birthDate)
                        return bday && bday >= 18 && bday < 21
                    })
                    break;
                case 21:
                    filter = usersCopy.filter(u => {
                        const bday = Number(u.birthDate)
                        return bday && bday >= 21
                    })
                    break;
            }
            setUsers(filter)
        }
    }





    return <PageHolder style={{ padding: '0px', scroll: 'hidden', background: BLACK_ELEGANT }}>
        <SectionTitle style={{}} title={'ניהול משתמשים - בטא'} />
        <label style={{ color: SECONDARY_WHITE, padding: '16px' }}>{'סה"כ: ' + usersCopy?.length + " משתמשים רשומים"}</label>

        <InnerPageHolder style={{ maxWidth: '300px', background: 'none', margin: '0px', border: 'none' }}>
            {users && users.length > 1 ? <table dir={'rtl'} className='user_table'>

                <tbody className='user_body_table'  >{users.map((user, index) => {
                    return <tr style={determineRowStyle(index)}
                        key={user.email + user.name}>
                        <th className="user_fields">{user.name}</th>
                        <th className='user_fields'>{user.birthDate}</th>
                        <th className='user_email_field'>{user.email}</th>
                        <th className="user_fields">{user.phone}</th>
                    </tr>
                })}</tbody>

            </table> : <table dir={'rtl'} className='user_table'><thead className='thead_user_statistics'><tr><th id='user_search_no_results'>לא נמצאו משתמשים</th></tr></thead></table>}

            <input onChange={(e) => { filterUsers(e) }} className='user_search_input'
                placeholder="חפש משתמש לפי שם/אימייל" />

            <span style={{ color: SECONDARY_WHITE }}>סנן לפי גיל</span>
            <select onChange={(e) => { filterUsersByAge(e) }} className='user_search_input'
                placeholder="חפש משתמש לפי שם/אימייל" >
                <option value='17'>גילאים 17-</option>
                <option value='18'>גילאים 18-20</option>
                <option value='21'>גילאים 21+</option>
                <option value='0'>הכל</option>
            </select>


        </InnerPageHolder></PageHolder>
}

export default withHookGroup(UserStatistics, CommonHooks)