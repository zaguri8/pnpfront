import { CSSProperties } from "react"

export type GalleryProps = {
    header: string
    images: string[],
}
export function Gallery(props: GalleryProps) {
    const containerStyle: CSSProperties = {
        padding: '24px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
    const headerStyle: CSSProperties = {
        fontFamily: 'Open Sans',
        textAlign: 'right',
        fontWeight: '100',
        alignSelf: 'flex-end',
        padding: '16px',
        margin: '0px',
        color: 'white'
    }
    const cardStyle: CSSProperties = {
        width: '200px',
        height: '100px',
        borderRadius: '8px',
        padding: '16px',

        margin: '8px'
    }
    const imageContainer: CSSProperties = {
        display: 'grid',
        alignItems: 'center',
        borderRadius: '8px',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr ',
        justifyContent: 'center',
        padding: '16px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
        textAlign: 'center'

    }
    return <div style={containerStyle}>
        {<h2 style={headerStyle}>{props.header}</h2>}
        <hr style={{
            width: '100%',
            marginBottom: '32px',
            marginTop: '16px',
            borderBlockWidth: '.1px', borderColor: 'white', background: 'white'
        }} />
        <div className='gallery' style={imageContainer}>
            {props.images.map(image => {

                return (<div ><img key={image} style={cardStyle} src={image} />
                    <h4 style={{ margin: '0px', padding: '0px' }}>Hel</h4></div>)
            })}
        </div>
    </div>
}