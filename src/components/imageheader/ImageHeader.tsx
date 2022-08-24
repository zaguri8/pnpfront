import { Stack } from "@mui/material";
import { useHeaderContext } from "../../context/HeaderContext";
import { PRIMARY_ORANGE, PRIMARY_PINK } from "../../settings/colors";
import { SIDE } from "../../settings/strings";
import search from '../../assets/images/search.png'
import { withHookGroup } from "../generics/withHooks";
import About from "../other/About";

function ImageHeader(props: any) {
    
    const { isShowingAbout } = useHeaderContext()
    return (<div id='header_image_container' className='App-header' style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        position: "relative",

        justifyContent: 'center'
    }}>
        <div className="header_content">
            {isShowingAbout && <About />}
            {isShowingAbout && <Stack
                spacing={1}
                style={{
                    transform: 'translateY(40px)'
                }}
                alignItems={'center'}
                direction={'row'}>
                <img

                    src={search} style={
                        {
                            cursor: 'pointer',
                            width: '25px', height: '25px', padding: '6px',
                            border: '.1px solid whitesmoke',
                            background: `linear-gradient(${PRIMARY_PINK},${PRIMARY_ORANGE})`,
                            borderRadius: '8px'
                        }}
                    onClick={() => {
                        props.nav('searchRide', { state: $('#search_home').val() })
                    }} />
                <input id="search_home" dir={SIDE(props.language.lang)} style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    minWidth: '250px'
                }} placeholder={props.language.lang === 'heb' ? "חפשו אירוע" : 'Search event'} />
            </Stack>}
        </div>
    </div>);
}


export default withHookGroup(ImageHeader, ['language', 'nav'])  