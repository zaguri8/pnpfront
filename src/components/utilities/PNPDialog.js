import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import $ from 'jquery'
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
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
    PICKED
} from '../../settings/strings';
import { Checkbox } from '@mui/material';
import { useLoading } from '../../context/Loading';

const events = [
    PICK_FAVORITE_1('heb'),
    PICK_FAVORITE_2('heb'),
    PICK_FAVORITE_3('heb'),
    PICK_FAVORITE_4('heb'),
    PICK_FAVORITE_5('heb'),
    PICK_FAVORITE_6('heb'),
    PICK_FAVORITE_7('heb')];

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog dir='rtl' onClose={handleClose} open={open}>
            <DialogTitle>{PICK_FAVORITE_EVENTS('heb')}</DialogTitle>

        </Dialog>
    );
}

export default function FavoriteEventsDialog() {
    const [selectedValue, setSelectedValue] = React.useState('');
    const dialogContext = useLoading()
    const handleListItemClick = (pickedValues) => {
        setSelectedValue(pickedValues)
        dialogContext.closeDialog()
    }
    const handleClickOpen = () => {
        dialogContext.openDialog({
            content: <div style={{ width: '100%' }}>
                {events.map((event) => (
                    <ListItem sx={{ textAlign: 'center' }} button key={event}>

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
                        sx={{ width: '100%', color: 'white' }} >{PICK('heb')}</Button>
                </ListItem>
            </div>, title: PICK_FAVORITE_EVENTS('heb')
        })
    };

    return (
        <div dir='rtl'>
            <Button sx={{ color: 'white' }} variant="outlined" onClick={handleClickOpen}>
                {OPEN_FAVORITE_EVENTS_DIALOG('heb')}
            </Button>
            <br /><br />
            <Typography id='selected_favorite_events' variant="subtitle1" component="div">
                {selectedValue.length > 0 ? `${PICKED('heb')}${selectedValue}` : ''}
            </Typography>
        </div>
    );
}