import { ListItem, FormControl, List, InputLabel,Input, TextField } from "@mui/material";
import { useState } from "react";
import PlacesAutocomplete from 'react-places-autocomplete'
import { v4 } from "uuid";
import { useGoogleState } from "../../context/GoogleMaps";
import { makeStyles } from "@mui/styles";
import { DESTINATION_POINT } from "../../settings/strings";
export default function Places({ placeHolder }) {
    const [address, setAddress] = useState('')
    const handleChange = (value) => {
        setAddress(value)
    }
    const { google } = useGoogleState()
    const handleSelect = (value) => {
        setAddress(value)
    }

    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        shrink: {
            transformOrigin: "top right"
        }
    }));
    const classes = useStyles()

    return (<ListItem>

        <FormControl style={{ dislay: 'flex', }}>
            {google && <PlacesAutocomplete
                onError={(err) => { }}
                searchOptions={{
                    location: new google.maps.LatLng(31.046051, 34.851612),
                    radius: 526,
                    componentRestrictions: { country: 'il' },
                    types: ['address']
                }}
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}  >
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps
                }) => (
                    <div dir='rtl' style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <TextField
                        label = {placeHolder}
                        classes = {{
                            shrink:classes.shrink
                        }}
                        sx={{ direction: 'rtl' }}
                            {...getInputProps({
                                placeholder: placeHolder,
                            })}
                        />
                        
                        <List dir='rtl' style={{ position: 'relative', zIndex: '9999', overflow: 'scroll', width: '300px' }}>

                            {suggestions.map((suggestion, index) => {
                                const style = suggestion.active
                                    ? { backgroundColor: "whitesmoke", textAlign: 'right', cursor: "pointer", fontSize: '14px' }
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