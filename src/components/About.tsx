import { useLanguage } from '../context/Language'
import { ABOUT_CONTENT } from '../settings/strings'
export default function About() {

    const { lang } = useLanguage()
    return <span style= {{fontSize:'18px',minWidth:'300px'}} >
        {ABOUT_CONTENT(lang)}
    </span>
}