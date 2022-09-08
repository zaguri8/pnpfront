import { Unsubscribe } from "firebase/database";
import React from "react";
import { Realtime, StoreSingleton } from "../../store/external";
import { Hooks } from "./types";
import { withHookGroup } from "./withHooks";

export interface IDataComponentState<T> {
    data: T | undefined
    unsubscribeData: Unsubscribe | undefined
}
export type DataComponentProps<T> = {
    render: (data: T) => React.ReactChild
    dft: (realTime: Realtime) => ((consume: (a: T) => void) => Unsubscribe)
} & Partial<Hooks>

abstract class DBComponent<T> extends
    React.Component<DataComponentProps<T>, IDataComponentState<T>>{

    constructor(props: DataComponentProps<T>) {
        super(props)
    }

    async componentDidMount() {
        let rt = StoreSingleton.get().realTime
        let f = this.props.dft(rt).bind(rt)
        this.setState({
            ...this.state,
            unsubscribeData: f(data => this.setState({ ...this.state, data }))
        })
    }
    componentWillUnmount() {
        if (this.state.unsubscribeData)
            this.state.unsubscribeData()
    }

    render(): React.ReactNode {
        return <React.Fragment>
            {this.state && this.state.data && this.props.render(this.state.data!)}
        </React.Fragment>
    }
}

export default function DataComponent<T>() {
    return withHookGroup<DataComponentProps<T>>(DBComponent, ['user'])
}