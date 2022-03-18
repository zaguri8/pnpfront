import * as React from 'react';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
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
                {/** TODO: 18/03/22 :    assign to value in a condition to make item keys and map for check box behaviour     */}
                {x = (function makeKeys() { })() && events.map((event) => (
                    <ListItem sx={{ textAlign: 'center' }} key={event}>

                        <ListItemText primary={event} />
                        <Checkbox value={event} className={'event_checkBox'} />

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
                        sx={{ width: '100%', color: 'white' }} >{PICK(lang)}</Button>
                </ListItem>
            </div>, title: PICK_FAVORITE_EVENTS(lang)
        })
    };

    return (
        <div dir={SIDE(lang)}>
            <Button sx={{ color: 'white', fontSize: '16px' }} variant="outlined" onClick={handleClickOpen}>
                {OPEN_FAVORITE_EVENTS_DIALOG(lang)}
            </Button>
            <Typography id='selected_favorite_events' variant="subtitle1" component="div">
                {selectedValue.length > 0 ? `${PICKED(lang)}${selectedValue}` : ''}
            </Typography>
        </div>
    );
}