import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
export default function HTMLFromText({ text, style }) {

    const [hState, setHState] = useState()
    useEffect(() => {
        setHState(DOMPurify.sanitize(text, { USE_PROFILES: { html: true } }))
    }, [])
    return hState ? <div style={{
        ...style
    }} dangerouslySetInnerHTML={{ __html: hState === 'null' ? '' : hState }} /> : null
}