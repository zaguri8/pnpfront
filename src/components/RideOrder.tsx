import {v4 as uuidv4} from 'uuid';


/*
    Ride order Destination
    id: unqiue location identifier
    name: name of the destination
    extra: extra details about the destination
*/
type Destinaton = {
    id:string,
    name:string,
    extra:string
}

/*
    Ride order Settings
    id : unique ride identifier
    destination: the destination of the ride
    startingPoint: the starting point of the ride
    passengers: number of passengers on the ride
    date: the date of the ride order
    
*/

type RideOrderSettings = {
    id:string,
    destination:Destinaton,
    startingPoint:string,
    passengers:number,
    date:number,
    email:string,
    phone:string,
    comments:string
}

/*
    RideOrder
    this class represents a ride order
*/
export default class RideOrder {
    settings:RideOrderSettings
    constructor(settings : RideOrderSettings,generateUID:boolean = true) {
        this.settings = settings
        if (generateUID)
            this.settings.id = uuidv4() // genereate a random id when created
    }


    saveToDatabase() {

    }
}
