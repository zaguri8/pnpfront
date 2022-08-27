import React, { useEffect } from "react"
import { SECONDARY_WHITE } from "../../settings/colors"
import { StyleBuilder } from "../../settings/styles.builder"
import { Hooks } from "../generics/types"
import { withHookGroup } from "../generics/withHooks"
import { PageHolder } from "../utilityComponents/Holders"
import { PRIMARY_GRADIENT } from "./Barcode"

interface RowData {
    id: string
    name: string
    image: string
    height: number
    width: number
}
function Test(props: Partial<Hooks>) {
    let items: RowData[] = [
        { id: '1', name: 'ron', image: 'xx.jpg', height: 100, width: 40 },
        { id: '2', name: 'natali', image: 'jsxd.jpg', height: 120, width: 224 },
        { id: '3', name: 'avraham', image: 'yona.jpg', height: 75, width: 13 }
    ]
    const renderRow = (item: RowData) => {
        let labelStyle = new StyleBuilder()
            .textColor(SECONDARY_WHITE)
            .fontSize(12)
            .bold()
            .build()

        let itemStyle = new StyleBuilder()
            .background(PRIMARY_GRADIENT)
            .borderRadius(4)
            .border(1,SECONDARY_WHITE)
            .minWidth(130)
            .widthPercent(33)
            .build()
        return <div style={itemStyle}>
            <p style={labelStyle}> {item.name}</p>
            <p style={labelStyle}>  {item.width}</p>
            <p style={labelStyle}> {item.height}</p>
            <p style={labelStyle}> {item.image}</p>
        </div>
    }
    let wrapperStyle = new StyleBuilder()
        .whiteText()
        .grid()
        .gridColumns(3)
        .gridRows(1)
        .fullWidth()
        .textAlignCenter()
        .fullCenter()
        .build()

    let outerWrapper = new StyleBuilder()
        .fullWidth()
        .flexColumn()
        .build()
    let Wrapper = (props: { children: any }) => {
        return <div style={wrapperStyle}>
            {props.children}
        </div>
    }
    useEffect(() => {
        props.headerExt?.hideHeader()
    }, [])
    return <PageHolder>
        {/* <div style={outerWrapper}>
            <PNPList<RowData>
                items={items}
                renderRow={renderRow}
                ElementWrapper={Wrapper} />
        </div> */}
    </PageHolder>
}

export default withHookGroup(Test, ['headerExt'])