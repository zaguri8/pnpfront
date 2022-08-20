import { CSSProperties } from "react";
import { submitButton } from "../../settings/styles";
import { Styles } from "./simpleform.types";

export const FormStyles: Styles = {
    formLabelStyle: {
        color: 'white',
        padding: '4px',
        fontSize: '14px'
    } as CSSProperties,
    inputStyle: {
        padding: '4px',
        border: 'none',
        width:'100%',
        background: 'white',
        borderRadius: '8px'
    } as CSSProperties,
    formStyle: {
        maxWidth: '300px',
        width: 'max-content',
        padding: '16px',
        display: 'flex',
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
        maxHeight: '30px',
    } as CSSProperties
}
