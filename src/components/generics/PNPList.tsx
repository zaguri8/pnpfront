import React from "react"

interface Render<T> {
    items: T[]
    ElementWrapper?: any
    renderRow: (item: T) => React.ReactNode
}

export default function PNPList<T>(
    props: Render<T>
) {
    let Wrapper = props.ElementWrapper
    if (Wrapper)
        return <Wrapper>
            {props.items.map(props.renderRow)}
        </Wrapper>

    return <ul>
        {props.items.map(props.renderRow)}
    </ul>
}