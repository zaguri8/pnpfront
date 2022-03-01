import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../../context/Language';
import { SIDE } from '../../settings/strings';


export function EventDialog(props: { open: any }) {
    const { open } = props;
    const { lang } = useLanguage()
    const handleListItemClick = () => {

    };

    return (
        <Dialog dir={SIDE(lang)} open={open}>
            <DialogTitle>{'NOT SET'}</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem>
                    <Button
                        onClick={() => {
                            handleListItemClick()
                        }}
                        sx={{ width: '100%', color: 'white' }} >{'NUAH SET'}</Button>
                </ListItem>
            </List>
        </Dialog>
    );
}

EventDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default function FavoriteEventsDialog() {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { lang } = useLanguage()
    return (
        <div dir={SIDE(lang)}>
            <Button sx={{ color: 'white' }} variant="outlined" onClick={handleClickOpen}>

            </Button>
            <br /><br />
            <Typography id='selected_favorite_events' variant="subtitle1" component="div">

            </Typography>
            <EventDialog
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}