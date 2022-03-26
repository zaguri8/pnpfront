import * as React from 'react';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import { PRIMARY_WHITE, SECONDARY_WHITE } from '../../settings/colors';
import $ from 'jquery'
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {
    PICK_FAVORITE_EVENTS,
    PICK_FAVORITE_1,
    PICK_FAVORITE_2,
    PICK_FAVORITE_3,
    PICK_FAVORITE_4,
    PICK_FAVORITE_5,
    PICK_FAVORITE_6,
    PICK_FAVORITE_7,
    OPEN_FAVORITE_EVENTS_DIALOG,
    PICK,
    PICKED,
    SIDE
} from '../../settings/strings';
import { Checkbox } from '@mui/material';
import { useLoading } from '../../context/Loading';
import { useLanguage } from '../../context/Language'
import { submitButton } from '../../settings/styles';


export default function FavoriteEventsDialog() {

    const { lang } = useLanguage()
    const events = [
        PICK_FAVORITE_1(lang),
        PICK_FAVORITE_2(lang),
        PICK_FAVORITE_3(lang),
        PICK_FAVORITE_4(lang),
        PICK_FAVORITE_5(lang),
        PICK_FAVORITE_6(lang),
        PICK_FAVORITE_7(lang)];
    const [selectedValue, setSelectedValue] = React.useState('');
    const dialogContext = useLoading()
    const handleListItemClick = (pickedValues) => {
        setSelectedValue(pickedValues)
        dialogContext.closeDialog()
    }
    const handleClickOpen = () => {
        var x = null
        dialogContext.openDialog({
            content: <div style={{ width: '100%' }}>
                {events.map((event) => (
                    <ListItem sx={{ textAlign: 'center', color: SECONDARY_WHITE }} key={event}>

                        <ListItemText primary={event} />
                        <Checkbox value={event} style={{ color: PRIMARY_WHITE }} className={'event_checkBox'} />

                    </ListItem>
                ))}
                <ListItem>
                    <Button
                        onClick={() => {
                            var allPicked = ""
                            $.each($('.event_checkBox'), function (index, element) {
                                if ($(element.children[0]).is(':checked')) {
                                    allPicked += (index === 0 || index === $('.event_checkBox').length ? '' : ' 🎉 ') + $(element.children[0]).val()
                                }
                            })
                            handleListItemClick(allPicked)
                        }}
                        sx={{ ...submitButton(false),...{width:'100%',padding:'4px'} }} >{PICK(lang)}</Button>
                </ListItem>
            </div>, title: PICK_FAVORITE_EVENTS(lang)
        })
    };

    return (
        <div dir={SIDE(lang)}>
            <Button style={{ ...submitButton(false), ...{ padding: '8px', margin: '0px', fontSize: '14px', width: '100%' } }} variant="outlined" onClick={handleClickOpen}>
                {OPEN_FAVORITE_EVENTS_DIALOG(lang)}
            </Button>
            <Typography id='selected_favorite_events' variant="subtitle1" component="div">
                {selectedValue.length > 0 ? `${PICKED(lang)}${selectedValue}` : ''}
            </Typography>
        </div>
    );
}