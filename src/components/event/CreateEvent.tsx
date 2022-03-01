import { FormControl,  TextField, Stack, TextFieldProps, Select, MenuItem } from "@mui/material";
import { useLanguage } from "../../context/Language";
import { CREATE_EVENT_TITLE, EVENT_ADDRESS, EVENT_END, EVENT_START, EVENT_TITLE, PICK_IMAGE, SIDE } from "../../settings/strings";
import { InnerPageHolder, PageHolder } from "../utilities/Holders";
import SectionTitle from "../SectionTitle";
import { useState } from "react";
import Places from "../utilities/Places";
import { makeStyles } from "@mui/styles";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker } from "@mui/lab"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "draft-js";
import { event_placeholder } from "../../assets/images";

export default function CreateEvent() {
    const { lang } = useLanguage()
    const [editorState, setEditorState] = useState<EditorState | undefined>()
    const useStyles = makeStyles(theme => ({
        labelRoot: {
            right: '-64px'

        },
        shrink: {
            transformOrigin: "top right"
        }
    }));
    const classes = useStyles()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const onEditorStateChanged = (state: EditorState) => {
        setEditorState(state)
    }
    const [image, setImage] = useState<string>('')
    return (<PageHolder>
        <SectionTitle title={CREATE_EVENT_TITLE(lang)} style={{}} />
        <InnerPageHolder>
            <Stack spacing={3}>
                <FormControl>
                    <input onChange={(event) => {
                        if (event.target.files) {
                            setImage(URL.createObjectURL(event.target.files[0]))
                            $('#menu_event_create_image').css('borderRadius', '75px')
                        }

                    }} type="file" id="files_create_event" style={{ display: 'none' }} />
                    <img id='menu_event_create_image' alt='' src={image ? image : event_placeholder} style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderRadius: '75px',
                        minHeight: '150px',
                        maxWidth: '150px',
                        height: '75px'
                    }} />          <label style={{
                        color: 'black',
                        padding: '8px',
                        borderRadius: '8px',
                        alignSelf: 'center',
                        marginTop: '8px',
                        width: 'fit-content',
                        background: 'white'
                    }} onChange={(e) => alert(e)} htmlFor='files_create_event'>{PICK_IMAGE(lang, true)}</label>
                </FormControl>
                <FormControl>
                    <TextField
                        placeholder={EVENT_TITLE(lang)}
                        label={EVENT_TITLE(lang)}
                        dir='rtl'
                        sx={{
                            background: 'white',
                            direction: SIDE(lang)
                        }} />

                </FormControl>
                <FormControl>
                    <Places className={''} id={''} fixed style={{
                        width: '100%',
                        background: 'white'
                    }} placeHolder={EVENT_ADDRESS(lang)} />

                </FormControl>

                <FormControl sx={{ background: 'white' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={EVENT_START(lang)}
                            value={startDate}
                            onChange={(val: any) => setStartDate(val)}
                            renderInput={(params: TextFieldProps) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl sx={{ background: 'white' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker

                            label={EVENT_END(lang)}
                            value={endDate}
                            onChange={(val: any) => setEndDate(val)}
                            renderInput={(params: TextFieldProps) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <Select >
                        <MenuItem>Hello</MenuItem>
                    </Select>

                </FormControl>
                <FormControl>
                    <Editor
                        editorStyle={{ background: 'white', minHeight: '200px' }}
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChanged}
                    />
                </FormControl>
            </Stack>
        </InnerPageHolder>
    </PageHolder>)

}