import { useEffect } from "react"
import { useLoading } from "../context/Loading"

export default function Test() {
    const {doLoad} = useLoading()
    useEffect(()=>{doLoad()},[])
    return <div></div>
}