

import React, { createRef, CSSProperties } from "react"
import { Hooks } from "../../generics/types"
import { withHooks } from "../../generics/withHooks"
import newData from '../../../assets/newData.json'
import SimpleForm from "../../simpleForm/SimpleForm";
import { onGoogleLoaded } from "../../../context/GoogleMaps";
import { Stack } from "@mui/material";
import bus from '../../../assets/gifs/busanimated.gif'
import Spacer from "../../utilityComponents/Spacer";
import { PRIMARY_BLACK, PRIMARY_PINK } from "../../../settings/colors";
import { PageHolder } from "../../utilityComponents/Holders";
type PriceEval = { "km-twoway": number; "price-twoway": number; "km-oneway"?: undefined; "price-oneway"?: undefined; } | { "km-twoway": number; "price-twoway": number; "km-oneway": number; "price-oneway": number; }
type AlegPriceEval = PriceEval | null | undefined



async function ridePriceEval(start: string, dest: string): Promise<AlegPriceEval> {
    return new Promise((res, rej) => {
        onGoogleLoaded(async () => {
            try {
                var service = new google.maps.DistanceMatrixService();
                const response = await service.getDistanceMatrix(
                    {
                        origins: [start],
                        region: 'IL',
                        destinations: [dest],
                        travelMode: google.maps.TravelMode.DRIVING
                    });
                if (response === null) { console.log("could not load.."); return null; }
                let km = Number(response.rows[0].elements[0].distance.text.replace(' ק"מ', '').replace(' km', '').replace('km ', ''))
                let evalP: AlegPriceEval
                evalP = newData.find(o => {
                    return o["km-oneway"] !== undefined && Math.abs(o["km-oneway"] - km) <= 1
                })
                if (evalP) {
                    if (evalP["km-oneway"])
                        evalP["km-oneway"] = Number(evalP["km-oneway"].toFixed(3))
                    if (evalP["km-twoway"])
                        evalP["km-twoway"] = Number(evalP["km-twoway"].toFixed(3))
                    if (evalP["price-oneway"])
                        evalP["price-oneway"] = Number(evalP["price-oneway"].toFixed(3))
                    if (evalP["price-twoway"])
                        evalP["price-twoway"] = Number(evalP["price-twoway"].toFixed(3))
                }
                res(evalP)
            } catch (e) {
                rej(e)
            }
        })
    })

}



class PriceStatistics extends React.Component<Hooks, AlegPriceEval | { error: any }> {

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
        start = start.replaceAll(', Israel', '').replaceAll(', israel', '').replaceAll(', ישראל', '')
        dest = dest.replaceAll(', Israel', '').replaceAll(', israel', '').replaceAll(', ישראל', '')
        const p_eval = await ridePriceEval(start, dest) as AlegPriceEval
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
                        <label style={this.labelStyle}>מרחק: {p_eval["km-oneway"] + ` ק"מ`}</label>
                        <label style={this.labelStyle}>מחיר: {p_eval["price-oneway"] + ` ש"ח`}</label>
                    </Stack>
                    <Stack style={{ padding: '8px' }}>
                        <h3 style={this.headerStyle}>{'שתי כיוונים'}</h3>
                        <label style={this.labelStyle}>מרחק: {p_eval["km-twoway"] + ` ק"מ`}</label>
                        <label style={this.labelStyle}>מחיר: {p_eval["price-twoway"] + ` ש"ח`}</label>
                    </Stack>
                </Stack>
            </React.Fragment>, 'success', 7500)
        }
    }

    componentDidMount() {
        this.props.backgroundExt.changeBackgroundColor('black')
        this.props.headerExt.hideHeader()
        onGoogleLoaded(() => {
            const options = {

                types: ['geocode'],
                componentRestrictions: { country: 'il' },
                fields: ["formatted_address", "name", "geometry"]
            } as google.maps.places.AutocompleteOptions
            if (this.startRef !== null) {
                const searchBox = new google.maps.places.Autocomplete(this.startRef.current as HTMLInputElement, options)
            }
            if (this.destRef !== null) {
                const searchBox = new google.maps.places.Autocomplete(this.destRef.current as HTMLInputElement, options)
            }
        })
    }

    componentWillUnmount() {
        this.props.backgroundExt.changeBackgroundColor(PRIMARY_BLACK)
        this.props.headerExt.showHeader()
    }
    inputStyle = {
        padding: '8px',
        width: 'fit-content',
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
        return <PageHolder>
            <div style={{ padding: '32px' }}>
                <SimpleForm
                    style={{ minWidth: 'fit-content', maxWidth: '400px' }}
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
                    onSubmit={async (values) => {
                        this.props.loading.doLoad()
                        await this.load(values['start'], values['dest'])
                        this.props.loading.cancelLoad()
                    }}
                />
                {(() => {
                    const outputEval = this.state as AlegPriceEval
                    if (outputEval) {
                        return <Stack direction={'row'}
                            alignSelf={'center'}
                            marginLeft={'auto'}
                            marginRight={'auto'}
                            style={{ direction: 'rtl' }}
                            width={'fit-content'}>
                            <Stack style={{ padding: '8px' }}>
                                <h3 style={this.headerStyle}>{'כיוון אחד'}</h3>
                                <label style={this.labelStyle}>מרחק: {outputEval["km-oneway"] + ` ק"מ`}</label>
                                <label style={this.labelStyle}>מחיר: {outputEval["price-oneway"] + ` ש"ח`}</label>
                            </Stack>
                            <Stack style={{ padding: '8px' }}>
                                <h3 style={this.headerStyle}>{'שתי כיוונים'}</h3>
                                <label style={this.labelStyle}>מרחק: {outputEval["km-twoway"] + ` ק"מ`}</label>
                                <label style={this.labelStyle}>מחיר: {outputEval["price-twoway"] + ` ש"ח`}</label>
                            </Stack>
                        </Stack>
                    } else {
                        return <label style={this.labelStyle}>{''}</label>
                    }
                })()}
            </div>
        </PageHolder>
    }
}

export default withHooks(PriceStatistics)

