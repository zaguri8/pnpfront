
import { Unsubscribe } from "firebase/database"
import React from "react"


export interface IFirebaseInterace {
    addListeners?: (listener: any) => Set<Unsubscribe>
}

export type IFirebaseCProps = {
    arg1: any
}
export type IFirebaseCState = {
    subscriptions: Set<Unsubscribe>
}
export class IFirebaseComponent extends React.Component<IFirebaseCProps, IFirebaseCState> implements IFirebaseInterace {

    constructor(props: IFirebaseCProps) {
        super(props)
    }

    componentDidMount() {
        if (this.addListeners) {
            const subscriptions = this.addListeners()
            this.setState({ subscriptions: subscriptions })
        }
    }

    componentWillUnmount() {
        if (this.state.subscriptions) {
            const unsub = (unsub:Unsubscribe) => unsub()
            this.state.subscriptions.forEach(unsub)
        }
    }
    addListeners: (() => Set<Unsubscribe>) | undefined;
}