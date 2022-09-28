import { Unsubscribe } from "firebase/auth";
import { useEffect, useState } from "react";
import { ILoadingContext } from "../../context/Loading";
import { StoreSingleton } from "../../store/external";
import { PNPCompany, PNPCompanyRideConfirmation, PNPRideConfirmation, PNPWorkersRide } from "../../store/external/types";
import { isValidCompany } from "../../store/validators";
import { getDaysInCurrentMonth, getDaysInMonth } from "../../utilities";
import { Hooks } from "../generics/types";
import { getAllWeekDaysLeft, getAllWeekDaysLeftFromDate, getDateRange, getMonths, isEqualDates, trueDateForSelectedRide, userHasConfirmationForDate } from "./invitationsWorkerHelper";

type DayMapping = { [day: string]: PNPWorkersRide }
type WeekMapping = { [week: string]: DayMapping }
export type SelectedRide = { day: number, week: number, ride: PNPWorkersRide } | null

export type IRidesCalendar = {
    userConfirmations: PNPCompanyRideConfirmation[],
    rides: PNPWorkersRide[],
    today: Date,
    selectedRide: SelectedRide,
    confirmationForWeek: PNPCompanyRideConfirmation | undefined,
    company: PNPCompany | null | undefined,
    selectedWeek: number,
    weekDays: number[],
    saveConfirmation: () => void,
    selectRide: (ride: SelectedRide) => void,
    weekForwards: () => void,
    weekBackwards: () => void
} | undefined


export default function CompanyRidesCalendar(hooks: Hooks, companyId?: string): IRidesCalendar {
    if (!companyId) return
    const [userConfirmations, setConfirmations] = useState<PNPCompanyRideConfirmation[]>([])
    const [confirmationForWeek, setConfirmationForWeek] = useState<PNPCompanyRideConfirmation>()
    const [selectedRide, setSelectedEventRide] = useState<SelectedRide>(null)
    const [rides, setRides] = useState<PNPWorkersRide[]>([])
    const [weekDays, setWeekDays] = useState<number[]>(getAllWeekDaysLeft());
    const [company, setCompany] = useState<PNPCompany | null>()
    const [selectedWeek, setSelectedWeek] = useState(1)
    const [today, setToday] = useState(new Date())
    if (!companyId) return;


    const checkUserConfirmations = () => {
        const hasConfirmationForWeek = userHasConfirmationForDate(userConfirmations, getDateRange(today))
        setConfirmationForWeek(hasConfirmationForWeek)
    }
    useEffect(() => {
        let unsubscribe: Unsubscribe[] = []
        if (hooks.user.user) {
            unsubscribe.push(StoreSingleton.get().realTime.addListenerToWorkerConfirmations(hooks.user.user.uid, companyId, (confs) => {
                setConfirmations(confs)

            }))
        }
        return () => {
            unsubscribe.forEach(unsub => unsub());
        }
    }, [hooks.user.user])
    useEffect(() => {
        checkUserConfirmations()
    }, [userConfirmations])
    useEffect(() => {
        //  props.loading.doLoad()
        let unsubscribe: Unsubscribe[] = []
        unsubscribe.push(StoreSingleton.get().realTime.getPrivateCompanyById(companyId, (event) => {
            if (isValidCompany(event as PNPCompany)) {
                unsubscribe.push(StoreSingleton.get().realTime.getCompanyRidesById(companyId, (rides) => {
                    if (rides as PNPWorkersRide[]) {
                        setRides(rides)
                        setCompany(event)
                    }
                }))
            } else
                setCompany(null)
        }))
        return () => {
            for (let unsub of unsubscribe)
                if (unsub)
                    unsub()
        }
    }, [])



    return {
        userConfirmations, rides,
        company, selectedWeek, selectedRide, weekDays, today, confirmationForWeek,
        selectRide(r: SelectedRide) {
            setSelectedEventRide(r)
        },
        async saveConfirmation() {
            if (!company) {
                return;
            }
            if (!selectedRide) {
                return alert('יש לבחור הסעה כדי לאשר הגעה')
            }
            if (!hooks.user.appUser || !hooks.user.user) {
                return alert('עלייך להירשם על מנת לאשר הגעה להסעה')
            }
            hooks.loading.doLoad()
            const res = await StoreSingleton.get().realTime.addRideConfirmationWorkers(hooks.user.user.uid, {
                userId: hooks.user.user.uid,
                userName: hooks.user.appUser.name,
                phoneNumber: hooks.user.appUser.phone,
                companyId,
                rideId: selectedRide.ride.id,
                companyName: company.name,
                date: trueDateForSelectedRide(today, selectedRide)
            })
            hooks.loading.cancelLoad()
        },
        weekForwards() {
            hooks.loading.doLoad()
            const newDays = today.getDate() + 7
            if (newDays > getDaysInMonth(today)) {
                today.setDate(newDays - getDaysInMonth(today))
                today.setMonth(today.getMonth() + 1)
                if (today.getMonth() > 12) {
                    today.setFullYear(today.getFullYear() + 1)
                    today.setMonth(0);
                    today.setDate(0);
                }
            } else {
                today.setDate(newDays);
            }
            setSelectedWeek((week) => week + 1)
            setWeekDays(isEqualDates(today, new Date()) ? getAllWeekDaysLeft() : getAllWeekDaysLeftFromDate(today))
            checkUserConfirmations()
            setSelectedEventRide(null)
            setTimeout(() => {
                hooks.loading.cancelLoad()
            }, 300)
        },
        weekBackwards() {
            if (today.getTime() - (7) * 12 * 60 * 60 * 1000 < new Date().getTime())
                return
            hooks.loading.doLoad()
            const newDays = today.getDate() - 7
            if (newDays <= 0) {
                today.setMonth(today.getMonth() - 1)
                today.setDate(getDaysInMonth(today) + newDays)
                if (today.getMonth() < 0) {
                    today.setFullYear(today.getFullYear() - 1)
                    today.setMonth(0);
                }
            } else {
                today.setDate(newDays);
            }
            setSelectedWeek((week) => Math.max(1, week - 1))
            setWeekDays(isEqualDates(today, new Date()) ? getAllWeekDaysLeft() : getAllWeekDaysLeftFromDate(today))
            checkUserConfirmations()
            setSelectedEventRide(null)
            setTimeout(() => {
                hooks.loading.cancelLoad()
            }, 300)
        }
    }
}