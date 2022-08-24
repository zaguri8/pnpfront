import { Button } from "@mui/material"
import { SECONDARY_WHITE } from "../../settings/colors"


export type CSVLinkProps = {
    fileName: string
    columnHeaders: string[]
    data: any[][] | number[][]
}
export default function CSVLink(props: CSVLinkProps) {

    const getDownloadUri = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        let all = []
        all.push(props.columnHeaders)
        props.data.forEach(a => { all.push(a) })
        all.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        return encodedUri;
    }
    const csvLinkCss = {
        textDecoration: 'none',
        padding: '8px',
        width: '50%',
        minWidth: '200px',
        background: 'linear-gradient(#282c34,black)',
        borderRadius: '16px',
        fontFamily: 'Open Sans Hebrew',
        color: SECONDARY_WHITE
    }
    return (<Button
        dir={'rtl'}
        href={getDownloadUri()}
        style={csvLinkCss}>
        {'ייצא לקובץ CSV'}</Button>)
}