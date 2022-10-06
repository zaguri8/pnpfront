import styled from "@emotion/styled"
import React from "react"
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { PNPWorkersRide } from "../../store/external/types";
import { useIWContextConsumer } from "../invitation/InvitationCardWorkers";
import { Button, Stack } from "@mui/material";
import { SubmitConfirmationStyle } from "../invitation/InvitationUIProver";
import { CONFIRM_EVENT_ARRIVAL, CONFIRM_EVENT_ARRIVAL_2 } from "../../settings/strings";
import { useLanguage } from "../../context/Language";
import { PRIMARY_PINK } from "../../settings/colors";

interface Render<T> {
    items: T[]
    ElementWrapper?: any
    inlineCenter?: boolean,
    renderRow: (item: T, index?: number) => React.ReactNode
}

const ArrowControlStyle = (not_selected: boolean) => ({ transform: not_selected ? 'rotate(180deg)' : '', transition: '.275s linear', color: PRIMARY_PINK })
export default function PNPList<T>(
    props: Render<T>
) {

    let Wrapper = props.ElementWrapper
    if (Wrapper)
        return props.inlineCenter ? <InlineWrapper>
            {React.Children.toArray(props.items.map(props.renderRow))}
        </InlineWrapper> : <Wrapper>
            {React.Children.toArray(props.items.map(props.renderRow))}
        </Wrapper>
    return <ul>
        {props.items.map(props.renderRow)}
    </ul>
}

const InlineWrapper = styled.div`
    width: 90%;
    margin-inline: auto;
`

const CollapseWrapper = styled.div<{ collapsed: boolean }>`
    width:100%;
    margin-inline: auto;
    position: relative;
    transition: 1s linear;
    transform: ${x => x.collapsed ? 'scaleY(0)' : 'scaleY(1)'};
    height: ${x => x.collapsed ? '0px' : 'auto'};
    background-color: transparent;
`

export function CollapsingList<T>(props: Render<T> & { ride: PNPWorkersRide }) {
    const calendar = useIWContextConsumer()!
    const { lang } = useLanguage()
    const not_selected = calendar?.viewingRide !== props.ride
    return <React.Fragment>
        {!not_selected && <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} alignSelf={'flex-start'}>
            <input type='checkbox'
                checked={calendar.isAllSelected()}
                className='checkBox'
                onChange={() => calendar.selectAll(props.ride)} />
            <label style={{ fontSize: '14px' }}>{'בחר הכל'}</label>
        </Stack>}
        <CollapseWrapper collapsed={not_selected}>
            {React.Children.toArray(props.items.map(props.renderRow))}
        </CollapseWrapper>
        <KeyboardDoubleArrowUpIcon style={ArrowControlStyle(not_selected)} onClick={() => calendar?.setViewingRide(not_selected ? props.ride : undefined)} />
        {!not_selected && <Stack direction={'row'} justifyContent={'center'} width={'100%'}>

            {calendar.selectedRides.length > 0 && <Button onClick={() => {
                calendar.saveConfirmation()
            }}
                style={SubmitConfirmationStyle(lang)}
                disabled={calendar.selectedRides.length === 0}>
                {CONFIRM_EVENT_ARRIVAL(lang)}
                <b style={{ marginRight: '4px' }}>{" " + calendar.selectedRides.length}</b>
            </Button>}
            {calendar.selectedRidesRemove.length > 0 && <Button onClick={() => {
                calendar.removeConfirmation()
            }}
                style={SubmitConfirmationStyle(lang)}
                disabled={calendar.selectedRidesRemove.length === 0}>
                {CONFIRM_EVENT_ARRIVAL_2(lang) + " "}
                <b style={{ marginRight: '4px' }}>{" " + calendar.selectedRidesRemove.length}</b>
            </Button>}
        </Stack>}
    </React.Fragment>
}