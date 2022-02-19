import { CSSProperties } from "react"
import { v4 } from "uuid"
import { PRIMARY_WHITE } from "../colors"

export type GalleryProps = {
    header: string
    images: string[],
}

function GalleryItemTitle() {
    return (<h4 style={{
        background: 'rgba(0,0,0,0.5)',
        margin: '0px',
        marginTop: 'auto',
        padding: '8px',
        color: 'white',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
    }}>שם האירוע</h4>);
}


export function Gallery(props: GalleryProps) {
    const containerStyle: CSSProperties = {
        display: 'flex',
        overflow: 'scroll',
        justifyContent: 'center',
        paddingBottom: '32px',
        alignItems: 'start',
        direction: 'rtl',
        background: PRIMARY_WHITE,
        flexDirection: 'column'
    }

    const cardStyle: CSSProperties = {

        maxWidth: '200px',
        marginLeft: '32px',
        marginRight: '32px',
        minWidth: '200px',
        boxShadow: '0px 0px 6px 0px',
        minHeight: '150px',
        borderRadius: '4px'
    }
    const imageContainer: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        background: ' rgb(232,232,232)',
        overflow: 'auto',
        padding: '8px',
        justifyContent: 'center',
        textAlign: 'center'

    }
    const headerStyle: CSSProperties = {
        textAlign: 'right',
        fontWeight: '300',
        fontFamily: 'Open Sans Hebrew ',
        position: 'relative',
        alignSelf: 'flex-start',
        padding: '32px',
        fontSize: '28px',
        margin: '0px',
        color: 'black'
    }



    return <div>
        <div>

        </div>
        {<h2 className='gallery_header' style={headerStyle}>{props.header}</h2>}
        <div id='gallery_container' style={containerStyle}>
            <div className='gallery' style={imageContainer}>
                {props.images.map(image => {

                    return (<div key={v4()} className="gallery_img" style={{
                        ...cardStyle, ...{
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            background: `url('${image}') `,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center'
                        }
                    }} >

                        <GalleryItemTitle />

                    </div>)
                })}
            </div>
        </div>
    </div >
}