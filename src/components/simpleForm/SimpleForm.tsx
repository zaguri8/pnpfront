import { Button, Stack } from "@mui/material";
import React from "react";
import Spacer from "../utilityComponents/Spacer";
import { withHooks } from "../generics/withHooks";
import { FormStyles } from "./simpleform.styles";
import { SimpleFormField, SimpleFormProps, SimpleFormState, Styles } from "./simpleform.types";

class SimpleForm extends React.Component<SimpleFormProps, SimpleFormState> {
    private styles: Styles = FormStyles
    constructor(props: SimpleFormProps) {
        super(props);
        this.StandAloneFieldElements = this.StandAloneFieldElements.bind(this)
        this.CoupleFieldElements = this.CoupleFieldElements.bind(this)
        this.state = {}
    }

    private CoupleFieldElements() {
        if (!this.props.coupledFields) return null
        return <React.Fragment>
            <Stack
                style={this.props.layout === 'grid' ? {
                    display: 'grid',
                    rowGap: this.props.rowGap ? `${this.props.rowGap}px` : '0px',
                    columnGap: this.props.colGap ? `${this.props.colGap}px` : '0px',
                    gridTemplateColumns: `repeat(${this.props.numCols},1fr)`,
                    gridTemplateRows: `repeat(${this.props.numRows},1fr)`,
                    placeItems: 'center'
                } : {}}
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={1}>
                {this.props.layout.includes('linear') && <Spacer offset={1} />}
                {this.props.coupledFields.map((fields, index) =>
                    <this.StandAloneFieldElements
                        key={index + "coupled_field"}
                        fields={fields}
                        inStack={false} />)}
            </Stack>
        </React.Fragment>
    }

    private StandAloneFieldElements(props: { fields: SimpleFormField[], inStack: boolean }) {
        const El = props.fields.map(field => {
            return <Stack
                key={field.name + field.placeHolder}
                direction={'column'}
                alignItems={'center'}
                rowGap={0.5}
                justifyContent={'center'}>
                <label style={this.styles.formLabelStyle}>{field.label}</label>
                <input
                    id={field.name + "_input"}
                    ref={field.ref}
                    style={{
                        ...(field.style ?? this.styles.inputStyle),
                        maxWidth: '400px'
                    }}
                    type={field.type}
                    required={field.mandatory}
                    defaultValue={field.initialValue}
                    placeholder={field.placeHolder} />
            </Stack>
        })
        return <React.Fragment>
            {props.inStack ? <Stack
                spacing={1}
                style={{ width: '100%' }}
                alignItems={'center'}
                justifyContent={'center'}>{El}</Stack> : El}
        </React.Fragment>
    }


    render(): React.ReactNode {
        return <form style={{ ...this.styles.formStyle, ...{ ...this.props.style } }} onSubmit={(e) => {
            e.preventDefault();
            let map = {} as { [id: string]: string }
            for (let field of this.props.standAloneFields) {
                map[field.name] = $(`#${field.name}_input`).val() as string
            }
            if (this.props.coupledFields)
                for (let couple of this.props.coupledFields) {
                    for (let field of couple)
                        map[field.name] = $(`#${field.name}_input`).val() as string
                }
            this.props.onSubmit(map)
        }} dir={'rtl'}>

            {
                (() => {
                    if (this.props.standAlonePrioritize) {
                        return (<React.Fragment>
                            <this.StandAloneFieldElements fields={this.props.standAloneFields} inStack={true} />
                            <this.CoupleFieldElements />
                        </React.Fragment>)
                    } else {
                        return (<React.Fragment>
                            <this.CoupleFieldElements />
                            <this.StandAloneFieldElements fields={this.props.standAloneFields} inStack={true} />
                        </React.Fragment>)
                    }
                })()
            }

            <Button style={this.styles.submitStyle} type={'submit'}>{'שליחה'}</Button>
        </form>
    }
}
export default SimpleForm