

import React, { createRef, CSSProperties } from "react"
import { Hooks } from "../../generics/types"
import { withHooks } from "../../generics/withHooks"
import newData from '../../../assets/newData.json'
import SimpleForm from "../../simpleForm/SimpleForm";
import { onGoogleLoaded } from "../../../context/GoogleMaps";
import { Stack } from "@mui/material";
import Spacer from "../../utilities/Spacer";
export interface priceEval {
    "km-twoway": number;
    "price-twoway": number;
    "km-oneway"?: undefined;
    "price-oneway"?: undefined;
}
async function ridePriceEval(start: string, dest: string): Promise<priceEval | null> {
    var service = new google.maps.DistanceMatrixService();
    const response = await service.getDistanceMatrix(
        {
            origins: [start],
            destinations: [dest],
            travelMode: google.maps.TravelMode.DRIVING
        });
    if (response === null) { console.log("could not load.."); return null; }

    let twoWay = true;
    let km = Number(response.rows[0].elements[0].distance.text.replace(' ק"מ', ''))
    let offset = 1
    let output: priceEval | null = null
    while (offset <= 100 && output === null) {
        if (twoWay)
            output = newData.find(o => o["km-twoway"] && Math.abs(o["km-twoway"] - km) <= offset++) as priceEval
        else
            output = newData.find(o => o["km-oneway"] && Math.abs(o["km-oneway"] - km) <= offset++) as priceEval
    }
    return output
}


class PriceStatistics extends React.Component<Hooks, priceEval | undefined> {

    startRef = createRef<HTMLInputElement>()
    destRef = createRef<HTMLInputElement>()

    constructor(props: Hooks) {
        super(props)
        this.navigate = this.navigate.bind(this)
        this.load = this.load.bind(this)

    }

    private navigate() {
        this.props.nav('/')
    }

    private async load(start: string, dest: string) {
        console.log(start, dest)
        const p_eval = await ridePriceEval(start, dest) as priceEval
        if (p_eval)
            this.setState(p_eval)
        else
            this.setState({ error: 'No ride' })

        if (p_eval) {
            (this.props.loading as any).showPopover(<React.Fragment>
                <Stack direction={'row'}
                    alignSelf={'center'}
                    marginLeft={'auto'}
                    marginRight={'auto'}
                    style={{ direction: 'rtl' }}
                    width={'fit-content'}>
                    <Stack style={{ padding: '8px' }}>
                        <h3 style={this.headerStyle}>{'כיוון אחד'}</h3>
                        <label style={this.labelStyle}>מרחק: {p_eval["km-oneway"] ? p_eval["km-oneway"] + ` ק"מ` : 'לא נמצא'}</label>
                        <label style={this.labelStyle}>מחיר: {p_eval["price-oneway"] ? p_eval["price-oneway"] + ` ש"ח` : 'לא נמצא'}</label>
                    </Stack>
                    <Stack style={{ padding: '8px' }}>
                        <h3 style={this.headerStyle}>{'שתי כיוונים'}</h3>
                        <label style={this.labelStyle}>מרחק: {p_eval["km-twoway"] ? p_eval["km-twoway"] + ` ק"מ` : 'לא נמצא'}</label>
                        <label style={this.labelStyle}>מחיר: {p_eval["price-twoway"] ? p_eval["price-twoway"] + ` ש"ח` : 'לא נמצא'}</label>
                    </Stack>
                </Stack>
            </React.Fragment>,'success',7500)
        }
    }

    componentDidMount() {
        onGoogleLoaded(() => {
            const options = {
                types: ['geocode'],
                componentRestrictions: { country: 'il' },
                fields: ['types']
            } as google.maps.places.AutocompleteOptions
            if (this.startRef !== null) {
                const searchBox = new google.maps.places.Autocomplete(this.startRef.current as HTMLInputElement, options)
            }
            if (this.destRef !== null) {
                const searchBox = new google.maps.places.Autocomplete(this.destRef.current as HTMLInputElement, options)
            }
        })
    }
    inputStyle = {
        padding: '8px',
        width: '400px',
        direction: 'rtl'
    } as CSSProperties
    labelStyle = {
        padding: '0px',
        color: 'white',
        direction: 'rtl'
    } as CSSProperties
    headerStyle = {
        padding: '0px',
        color: 'white',
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
        direction: 'rtl'
    } as CSSProperties
    render(): React.ReactNode {
        return <div style={{ padding: '32px' }}>
            <SimpleForm
                style={{ minWidth: '400px', maxWidth: '400px' }}
                layout="grid"
                standAloneFields={[
                    {
                        style: this.inputStyle,
                        ref: this.startRef,
                        name: 'start',
                        label: 'נקודת יציאה',
                        placeHolder: 'הכנס נקודת יציאה',
                        initialValue: '',
                        mandatory: true,
                        type: 'text'
                    },
                    {
                        ref: this.destRef,
                        style: this.inputStyle,
                        name: 'dest',
                        label: 'יעד',
                        placeHolder: 'הכנס יעד',
                        initialValue: '',
                        mandatory: true,
                        type: 'text'
                    }
                ]}
                onSubmit={(values) => {
                    console.log(values)
                    this.load(values['start'], values['dest'])
                }}
            />
            {this.state ? <Stack direction={'row'}
                alignSelf={'center'}
                marginLeft={'auto'}
                marginRight={'auto'}
                style={{ direction: 'rtl' }}
                width={'fit-content'}>
                <Stack style={{ padding: '8px' }}>
                    <h3 style={this.headerStyle}>{'כיוון אחד'}</h3>
                    <label style={this.labelStyle}>מרחק: {this.state["km-oneway"] ? this.state["km-oneway"] + ` ק"מ` : 'לא נמצא'}</label>
                    <label style={this.labelStyle}>מחיר: {this.state["price-oneway"] ? this.state["price-oneway"] + ` ש"ח` : 'לא נמצא'}</label>
                </Stack>
                <Stack style={{ padding: '8px' }}>
                    <h3 style={this.headerStyle}>{'שתי כיוונים'}</h3>
                    <label style={this.labelStyle}>מרחק: {this.state["km-twoway"] ? this.state["km-twoway"] + ` ק"מ` : 'לא נמצא'}</label>
                    <label style={this.labelStyle}>מחיר: {this.state["price-twoway"] ? this.state["price-twoway"] + ` ש"ח` : 'לא נמצא'}</label>
                </Stack>
            </Stack> : <label style={this.labelStyle}>{''}</label>}
        </div>
    }
}

export default withHooks(PriceStatistics)

