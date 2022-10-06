import { PNPCompanyRideConfirmation, PNPWorkersRide } from "./types";



export type qPNPAbstractRideParams = {
    startPoint: string
    destination: string
    twoWay: boolean
};
export type qPNPRideParams = qPNPAbstractRideParams & {
    km: number
    cost: number
}



export type CompanyDateConfirmations = {date: string,
     confirmations: (PNPCompanyRideConfirmation & {dateObject:Date})[] }

export type CompanyConfirmationsMapping = {
    [ride: string]: CompanyDateConfirmations[]
}