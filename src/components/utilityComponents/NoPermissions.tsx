import { SECONDARY_WHITE } from "../../settings/colors"

export default function NoPermissions(props: { lang: string }) {

    return <div style={{ color: SECONDARY_WHITE }}>{
        props.lang === 'heb' ? 'אין לך גישות לעמוד זה' : 'You dont have required permissions to view this page'
    }</div>
}
