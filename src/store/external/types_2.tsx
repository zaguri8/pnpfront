


export type qPNPAbstractRideParams = {
    startPoint: string
    destination: string
    twoWay: boolean
};
export type qPNPRideParams = qPNPAbstractRideParams & {
    km: number
    cost: number
}


