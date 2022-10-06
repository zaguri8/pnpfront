

import React, { createRef, CSSProperties } from "react"
import { Hooks } from "../../generics/types"
import { withHooks } from "../../generics/withHooks"
import newData from '../../../assets/newData.json'
import SimpleForm from "../../simpleForm/SimpleForm";
import { onGoogleLoaded } from "../../../context/GoogleMaps";
import { Stack } from "@mui/material";
import { PRIMARY_BLACK, PRIMARY_PINK } from "../../../settings/colors";
import { PageHolder } from "../../utilityComponents/Holders";
import { millisToMinutesAndSeconds } from "../../../utilities";
type PriceEval = { "km-twoway": number; "price-twoway": number; "km-oneway"?: undefined; "price-oneway"?: undefined; } | { "km-twoway": number; "price-twoway": number; "km-oneway": number; "price-oneway": number; }
type AlegPriceEval = PriceEval | null | undefined



async function ridePriceEval(
    departureTime: string,
    checkoutTime: string,
    start: string,
    dest: string): Promise<Statistics> {
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
                const { distance, duration } = response.rows[0].elements[0]
                const { hours, minutes } = millisToMinutesAndSeconds(duration.text)
                if (response === null) { console.log("could not load.."); return null; }
                let km = Number(distance.text.replace(' ק"מ', '').replace(' km', '').replace('km ', ''))
                const stats = new Statistics(start, dest, departureTime, checkoutTime, km, { hours, minutes });
                res(stats)
            } catch (e) {
                rej(e)
            }
        })
    })

}



function compute(n: string, hour: boolean) {
    if (hour) {
        let x = Number(n.replace(/^0(?:0:0?)?/, ''))
        return ((x + 11) % 12 + 1)
    }
    return Number(n.replace(/^0(?:0:0?)?/, ''))
}

class Statistics {
    static initialValEarly = 640
    static initialValLate = 370
    km: number
    departureTime: string
    checkoutTime: string

    start: string
    dest: string
    estimatedRideTime: { hours: number, minutes: number }
    result?: number
    constructor(
        start: string,
        dest: string,
        departureTime: string,
        checkoutTime: string,
        km: number,
        estimatedRideTime: {
            hours: number,
            minutes: number
        }) {
        this.start = start
        this.dest = dest
        this.km = km
        this.departureTime = departureTime
        this.checkoutTime = checkoutTime
        this.estimatedRideTime = estimatedRideTime
    }

    calc(): number {
        let [departureHour, dipartureMinute] = this.departureTime.split(":");
        let [checkoutHour, checkoutMinute] = this.checkoutTime.split(":");
        const start_min = compute(dipartureMinute, false);
        const start_h = compute(departureHour, true);
        const end_min = compute(checkoutMinute, false);
        const end_h = compute(checkoutHour, true);
        let totalHours = Math.abs(end_h - start_h);
        totalHours += (end_min - start_min) / 60.0;
        if (this.estimatedRideTime.hours < 1 && this.estimatedRideTime.minutes < 30) {
            alert('ניתן לחשב זמן נסיעה כאשר זמן הנסיעה המשוער קטן או שווה זמן נסיעה עירוני ')
            this.result = -1;
            return -1;
        }
        else if (totalHours < 0.1) {
            alert("לא ניתן לחשב מחיר נסיעה עבור הזמנים שהוכנסו")
            return -1;
        }
        else if (totalHours < this.estimatedRideTime.hours) {
            alert("לא ניתן להוציא הסעה עם חזרה כאשר זמן הנסיעה גדול מההבדל בין יציאה לחזרה")
            this.result = -1;
            return -1
        }
        this.estimatedRideTime.hours *= 2;
        this.estimatedRideTime.minutes *= 2;
        let workingHoursPrice = 0;
        let i = 1;
        for (; i < totalHours; i++)
            workingHoursPrice += i > 8 ? 120 : 70
        if (i < totalHours)
            workingHoursPrice += (i > 8 ? 120 * (totalHours - i) : 70 * (totalHours - i));

        let distancePrice = (this.km) * 3.5;
        let totalPrice = distancePrice + workingHoursPrice
        if (start_h < 8 || (start_h === 8 && start_min <= 45))
            totalPrice += Statistics.initialValEarly
        else
            totalPrice += Statistics.initialValLate
        this.result = totalPrice
        return totalPrice
    }
}

class PriceStatistics2 extends React.Component<Hooks, Statistics | { error: any }> {

    startRef = createRef<HTMLInputElement>()
    destRef = createRef<HTMLInputElement>()
    firstDir = createRef<HTMLInputElement>()
    secondDir = createRef<HTMLInputElement>()
    constructor(props: Hooks) {
        super(props)
        this.navigate = this.navigate.bind(this)
        this.load = this.load.bind(this)

    }

    private navigate() {
        this.props.nav('/')
    }

    private async load(departureTime: string, checkoutTime: string, start: string, dest: string) {
        start = start.replaceAll(', Israel', '').replaceAll(', israel', '').replaceAll(', ישראל', '')
        dest = dest.replaceAll(', Israel', '').replaceAll(', israel', '').replaceAll(', ישראל', '')
        const p_eval = await ridePriceEval(departureTime, checkoutTime, start, dest)
        p_eval.calc()
        if (p_eval)
            this.setState(p_eval)
        else
            this.setState({ error: 'No ride' })


        if (p_eval && p_eval.result && p_eval.result > 0) {
            (this.props.loading as any).showPopover(<React.Fragment>
                <Stack direction={'row'}
                    alignSelf={'center'}
                    marginLeft={'auto'}
                    marginRight={'auto'}
                    style={{ direction: 'rtl' }}
                    width={'fit-content'}>
                    <Stack style={{ padding: '8px' }}>
                        <h3 style={this.headerStyle}>{`מחיר עבור הסעה מ - ${start} ל - ${dest}`}</h3>
                        <label style={this.labelStyle}>שעת יציאה: {p_eval.departureTime}</label>
                        <label style={this.labelStyle}>שעת חזרה:{p_eval.checkoutTime}</label>
                        <label style={this.labelStyle}>מרחק: {p_eval.km + ` ק"מ`}</label>
                        <label style={this.labelStyle}>מחיר: {p_eval.result + ` ש"ח`}</label>
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
                        }, {
                            ref: this.firstDir,
                            style: this.inputStyle,
                            name: 'firstDir',
                            label: 'שעת יציאה',
                            placeHolder: 'הכנס שעת יציאה',
                            initialValue: '',
                            mandatory: true,
                            type: 'time'
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
                        }, {
                            ref: this.secondDir,
                            style: this.inputStyle,
                            name: 'secondDir',
                            label: 'שעת חזרה',
                            placeHolder: 'הכנס שעת חזרה',
                            initialValue: '',
                            mandatory: true,
                            type: 'time'
                        }
                    ]}
                    onSubmit={async (values) => {
                        this.props.loading.doLoad()
                        await this.load(values['firstDir'], values["secondDir"], values['start'], values['dest'])
                        this.props.loading.cancelLoad()
                    }}
                />
                {(() => {
                    const outputEval = this.state as Statistics

                    if (outputEval) {
                        if (!outputEval.result || outputEval.result < 0) {
                            return <label style={this.labelStyle}>{`לא ניתן לחשב מחיר עם הנתונים הנל`}</label>
                        }
                        return <Stack direction={'row'}
                            alignSelf={'center'}
                            marginLeft={'auto'}
                            marginRight={'auto'}
                            style={{ direction: 'rtl' }}
                            width={'fit-content'}>
                            <Stack>
                                <h3 style={this.headerStyle}>{`מחיר עבור הסעה מ - ${outputEval.start} ל - ${outputEval.dest}`}</h3>

                                <label style={this.labelStyle}>שעת יציאה: {outputEval.departureTime}</label>
                                <label style={this.labelStyle}>שעת חזרה:{outputEval.checkoutTime}</label>
                                <label style={this.labelStyle}>סהכ זמן נסיעה משוער כולל {'הלוך חזור'}: {outputEval.estimatedRideTime.hours + "שעות " + outputEval.estimatedRideTime.minutes + " דקות"}</label>
                                <label style={this.labelStyle}>מרחק: {outputEval.km + ` ק"מ`}</label>
                                <label style={this.labelStyle}>מחיר: {outputEval.result + ` ש"ח`}</label>
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

export default withHooks(PriceStatistics2)

