



import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../context/Firebase";
import { useLoading } from "../../context/Loading";
import { StoreSingleton } from "../../store/external";
export default function LinkRedirect() {
    const { id } = useParams();
    const nav = useNavigate()
    const { doLoad, cancelLoad } = useLoading()
    const pageNotFound = () => {
        cancelLoad();
        alert('עמוד לא נמצא')
        nav('/')
    }
    useEffect(() => {
        if (id) {
            doLoad();
            StoreSingleton.get().realTime.getLinkRedirect(id, (link, err) => {
                if (err || !link) return pageNotFound();
                cancelLoad();
                window.open(link, '_self')
            })
        } else pageNotFound();
    }, [])
    return null;
}