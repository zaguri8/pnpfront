import { ListItem, FormControl, List, TextField } from "@mui/material";
import { useState } from "react";
import PlacesAutocomplete from 'react-places-autocomplete'
import { useGoogleState } from "../../context/GoogleMaps";
import { v4 } from 'uuid'
import '../../App.css'
import { SIDE } from "../../settings/strings";
import { useLanguage } from "../../context/Language";

import { makeStyles } from "@mui/styles";
import { PRIMARY_BLACK, SECONDARY_WHITE, SECONDARY_BLACK, DARK_BLACK, ORANGE_GRADIENT_PRIMARY } from "../../settings/colors";
export default function Places({ placeHolder, style, fixed, id, className, types, handleAddressSelect, value, ...extras }) {
    const [address, setAddress] = useState('')

    const strip = (str) => {
        return str.replaceAll(', Israel', '')
            .replaceAll(', ישראל', '');
    }

    const handleChange = (value) => {
        let strippedVal = strip(value)
        setAddress(strippedVal)
        handleAddressSelect(strippedVal)
    }
    const { google } = useGoogleState()

    const handleSelect = (value) => {
        let strippedVal = strip(value)
        setAddress(strippedVal)
        handleAddressSelect(strippedVal)
    }
    const useStyles = makeStyles(() => ({
        root: {
            "& .MuiOutlinedInput-root": {
                color: style.color ? style.color : PRIMARY_BLACK,
                background: (style && style.background) ? style.background : SECONDARY_WHITE,
                borderRadius: '32px'
            }
        }
    }));

    const classes = useStyles()

    const { lang } = useLanguage()
    return (<ListItem style={{ ...style, ...{ background: 'none', border: 'none' } }} id={id} className={className}>
        <FormControl style={{ ...style, ...{ background: 'none', border: 'none' } }}>
            {google && <PlacesAutocomplete
                onError={(err) => { }}
                searchOptions={{
                    location: new google.maps.LatLng(31.046051, 34.851612),
                    radius: 526,
                    componentRestrictions: { country: 'il' },
                    types: ["geocode"]
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
                        }, ...style, ...{ background: 'none' }
                    }}>
                        <TextField
                            variant='outlined'
                            id={(extras && extras.id) ? extras.id : v4()}
                            className={classes.root}
                            sx={{
                                ...{
                                    direction: SIDE(lang), maxHeight: '50px',
                                }, ...style, ...{ background: 'none' }
                            }}
                            {...getInputProps({
                                placeholder: placeHolder
                            })}
                        />

                        <List dir={SIDE(lang)} style={{
                            position: 'relative',
                            display: suggestions.length < 1 ? 'none' : 'inline',
                            padding: '.1px',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                            overflow: 'scroll',
                            background: DARK_BLACK,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            alignSelft: 'center',
                            width: '90%',
                            minWidth: fixed ? '300px' : 'fit-content'
                        }}>

                            {suggestions.map((suggestion, index) => {
                                const suggestionStyle = suggestion.active
                                    ? {
                                        background: ORANGE_GRADIENT_PRIMARY, boxShadow: '0px 4px 2px -2px gray', textAlign: 'right', cursor: "pointer", color: SECONDARY_WHITE, fontSize: '14px', border: '.1px solid white'
                                    }
                                    : { backgroundColor: SECONDARY_WHITE, cursor: "pointer", color: PRIMARY_BLACK, textAlign: 'right', fontSize: '14px', border: '.1px solid whitesmoke' };

                                return (
                                    <ListItem key={suggestion + index}{...getSuggestionItemProps(suggestion, { style: suggestionStyle })}>
                                        {strip(suggestion.description)}
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

