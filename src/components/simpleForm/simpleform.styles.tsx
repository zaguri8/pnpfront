import { CSSProperties } from "react";
import { submitButton } from "../../settings/styles";
import { Styles } from "./simpleform.types";

export const FormStyles: Styles = {
    formLabelStyle: {
        color: 'white',
        padding: '4px',
        fontWeight:'bold',
        margin:'4px',
        marginTop:'8px',
        fontSize: '14px'
    } as CSSProperties,
    inputStyle: {
        padding: '4px',
        border: 'none',
        background: 'white',
        borderRadius: '8px'
    } as CSSProperties,
    formStyle: {
        padding: '16px',
        display: 'flex',
        width:'80%',
        margin:'8px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignSelf: 'center'
    } as CSSProperties,
    submitStyle: {
        ...submitButton(4),
        textTransform: 'none',
        maxWidth:'250px',
        maxHeight: '30px',
    } as CSSProperties
}
