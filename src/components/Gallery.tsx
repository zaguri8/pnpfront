import { CSSProperties } from "react"

export type GalleryProps = {
    header: string
    images: string[],
}
export function Gallery(props: GalleryProps) {
    const containerStyle: CSSProperties = {
        display: 'flex',
        overflow: 'scroll',
        justifyContent: 'center',
        alignItems: 'start',
        direction:'rtl',
        background: 'white',
        flexDirection: 'column'
    }

    const cardStyle: CSSProperties = {

        maxWidth: '200px',
        marginLeft: '32px',
        marginRight: '32px',
        minWidth: '150px',
        boxShadow: '0px 0px 6px 0px',
        minHeight: '150px',
        borderRadius: '8px'
    }
    const imageContainer: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        overflow: 'auto',
        padding: '8px',
        justifyContent: 'center',
        textAlign: 'center'

    }
    return <div id='gallery_container' style={containerStyle}>

        <div className='gallery' style={imageContainer}>
            {props.images.map(image => {

                return (<div className="gallery_img" style={{
                    ...cardStyle, ...{
                        display: 'flex',
                        flexDirection: 'column',
                        background: `url('${image}') `,
                        backgroundSize: '100% 100%',             /* <------ */
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center'
                    }
                }}>

                    <h4 style={{
                        background: 'rgba(0,0,0,0.5)',
                        margin: '0px',
                        marginTop: 'auto',
                        padding: '8px',
                        color: 'white',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px'
                    }}>שם האירוע</h4>

                </div>)
            })}
        </div>
    </div>
}