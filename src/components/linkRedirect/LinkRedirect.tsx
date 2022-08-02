



import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useFirebase } from "../../context/Firebase";
import { useLoading } from "../../context/Loading";
export default function LinkRedirect() {
    const { id } = useParams();
    const { firebase } = useFirebase()
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
            firebase.realTime.getLinkRedirect(id, (link, err) => {
                if (err || !link) return pageNotFound();
                cancelLoad();
                window.open(link, '_self')
            })
        } else pageNotFound();
    }, [])
    return null;
}