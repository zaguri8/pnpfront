import DOMPurify from 'dompurify'
export default function HTMLFromText({ text, style }) {
    return <div style={{
        ...style
    }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text, { USE_PROFILES: { html: true } }) }} />
}