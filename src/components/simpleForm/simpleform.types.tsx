import { CSSProperties } from "react"

export type SimpleFormState = { [id: string]: any }


export type SimpleFormField = {
    type: 'number' | 'date' | 'text' | 'time' | 'email' | 'password' | 'tel'
    initialValue: any
    placeHolder: string
    name: string
    style?: CSSProperties
    ref?: any
    label: string
    mandatory: boolean
}
export type SimpleFormLayout = 'linear-row' | 'linear-column' | 'grid' | 'fusion'

export interface SimpleFormProps {
    standAloneFields: SimpleFormField[]
    numRows?: number,
    numCols?: number,
    standAlonePrioritize?: boolean,
    rowGap?: number,
    colGap?: number,
    style?: CSSProperties
    onSubmit: (state: { [id: string]: any }) => any
    coupledFields?: SimpleFormField[][]
    layout: SimpleFormLayout
}
export type Styles = { [name: string]: CSSProperties }

