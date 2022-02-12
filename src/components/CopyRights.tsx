import { CSSProperties } from "react"
export type CopyRightsProps = {
    style: CSSProperties
}
export function CopyRights(props: CopyRightsProps) {
    return <div id='copyrights' style={props.style}>
        {<p>Copyright 2022 Pick n Pull  Author NADAV AVNON</p>}
    </div>
}