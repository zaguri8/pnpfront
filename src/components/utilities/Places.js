import { ListItem, FormControl, List, TextField } from "@mui/material";
import { useState } from "react";
import PlacesAutocomplete from 'react-places-autocomplete'
import { useGoogleState } from "../../context/GoogleMaps";
import { v4 } from 'uuid'
import { SIDE } from "../../settings/strings";
import { useLanguage } from "../../context/Language";

import { makeStyles } from "@mui/styles";
import { PRIMARY_BLACK, SECONDARY_WHITE } from "../../settings/colors";
export default function Places({ placeHolder, style, fixed, id, className, types, handleAddressSelect, value }) {
    const [address, setAddress] = useState('')
    const handleChange = (value) => {
        setAddress(value)
        handleAddressSelect(value)
    }
    const { google } = useGoogleState()
    const [cId, setCId] = useState(v4())
    const handleSelect = (value) => {
        setAddress(value)
        handleAddressSelect(value)
    }
    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                color: PRIMARY_BLACK,
                background: (style && style.background) ? style.background : SECONDARY_WHITE,
                borderRadius: '32px'
            }
        }
    }));

    const classes = useStyles()

    const { lang } = useLanguage()
    return (<ListItem style={style} id={id} className={className}>
        <FormControl style={style}>
            {google && <PlacesAutocomplete
                onError={(err) => { }}
                searchOptions={{
                    location: new google.maps.LatLng(31.046051, 34.851612),
                    radius: 526,
                    componentRestrictions: { country: 'il' },
                    types: types
                }}
                value={address != undefined && address != null && address.length > 0 ? address : value != undefined && value != null ? value : ''}
                onChange={handleChange}
                onSelect={handleSelect}  >
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps
                }) => (
                    <div dir={SIDE(lang)} style={{
                        ...{
                            display: 'flex',
                            margin: '0px',
                            flexDirection: 'column'
                        }, ...style
                    }}>
                        <TextField
                            variant='outlined'
                            id={cId}
                            className={classes.root}
                            sx={{ ...{ direction: SIDE(lang), maxHeight: '50px' }, ...style }}
                            {...getInputProps({
                                placeholder: placeHolder
                            })}
                        />

                        <List dir={SIDE(lang)} style={{
                            position: 'relative',
                            zIndex: '9999',
                            overflow: 'scroll',
                            width: '100%',
                            minWidth: fixed ? '300px' : 'fit-content'
                        }}>

                            {suggestions.map((suggestion, index) => {
                                const style = suggestion.active
                                    ? { backgroundColor: "gray", textAlign: 'right', cursor: "pointer", color: 'white', fontSize: '14px' }
                                    : { backgroundColor: "white", cursor: "pointer", textAlign: 'right', fontSize: '14px' };

                                return (
                                    <ListItem key={suggestion + index}{...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                    </ListItem>)
                            })}
                        </List>
                    </div>
                )}
            </PlacesAutocomplete>}
        </FormControl>
    </ListItem >
    )
}

