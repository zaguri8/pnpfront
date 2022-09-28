import { getDateString, getDaysInCurrentMonth, getDaysInMonth } from "../../utilities";
import moment from 'moment'
import { IRidesCalendar, SelectedRide } from "./CompanyRidesCalendar";
import { PNPCompanyRideConfirmation } from "../../store/external/types";


export const getAllWeekDaysLeft = () => {
    const todaysDate = new Date();
    let days = []
    for (let i = todaysDate.getDay() + 1; i < 7; i++) {
        days.push(i);
    }
    return days;
}
export const getAllWeekDaysLeftFromDate = (date: Date) => {
    let days = []
    for (let i = 1; i < 7; i++) {
        days.push(i);
    }
    return days;
}
export function getWeekDays() {
    return moment.weekdays()
}
export function getMonths() {
    return moment.months();
}

export function determineOffset(today: Date) {
    return isEqualDates(today, new Date()) ? 0 : getAllWeekDaysLeft().length
}
export const userHasConfirmationForDate = (confirmations: PNPCompanyRideConfirmation[],
    dateRange: { d1: string, d2: string }) => {

    let month = Number(dateRange.d1.split('/')[1]);
    let day_start = Number(dateRange.d1.split('/')[0]);
    let day_end = Number(dateRange.d2.split('/')[0]);

    for (let conf of confirmations) {
        const conf_d_com = conf.date.split('/')
        const day = Number(conf_d_com[0])
        const conf_month = Number(conf_d_com[1])
        if (conf_month === month) {
            if (day >= day_start && day <= day_end) {
                return conf
            }
        }
    }
}
export const getDateRange = (today: Date) => {
    if (today) {
        const offset = (isEqualDates(today, new Date()) ? getAllWeekDaysLeft().length : getAllWeekDaysLeftFromDate(today).length) - 1
        let x1 = trueDateForSelectedRide(today, {
            day: today.getDate()
        })
        let x2 = trueDateForSelectedRide(today, {
            day: today.getDate() + offset
        })
        return { d1: x1, d2: x2 }
    }
    return { d1: "0", d2: "0" }
}
export const trueDateForSelectedRide = (today: Date, selected: any) => {
    const c = isEqualDates(today, new Date()) ? 0 : getAllWeekDaysLeft().length
    const daysInMonth = getDaysInMonth(today)
    let realM = (Math.max(1, (today.getMonth() + 1) % 13))
    let realD = (selected.day - c)
    if (realD < getAllWeekDaysLeft().length - 2) {
        realM -= 1;
        realD = Math.min(daysInMonth, daysInMonth + realD);
    } else if (realD > daysInMonth) {
        realM += 1;
        realD = Math.max(1, Math.abs(daysInMonth - realD));
    }
    return ("0" + realD).slice(-2) + "/" + ("0" + realM).slice(-2) + "/" + today.getFullYear();
}
export const isEqualDates = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
}
export const isEqualRides = (c: IRidesCalendar, selected: SelectedRide) => {
    return c?.selectedRide?.day == selected?.day && c?.selectedRide?.ride === selected?.ride && c?.selectedRide?.week === c?.selectedWeek
}

export const nameforDir = (dir: number) => dir === 1 ? 'הלוך' : dir === 2 ? 'חזור' : 'הסעה דו כיוונית (הלוך חזור)'

export const getDateWithDayString = (day: number) => {
    const today = new Date();
    const date = getDateString(today.getTime());
    const c = date.split("/");
    c[0] = Number(c[0]) + day + "";
    if (Number(c[0]) > getDaysInCurrentMonth())
        c[1] = Number(c[1]) + 1 + "";
    if (Number(c[1]) > 12)
        c[2] = Number(c[2]) + 1 + "";
    else if (Number(c[0]) <= today.getDay() && Number(c[1]) === today.getMonth() && Number(c[2]) === today.getFullYear())
        return date;
    return c.join('/');
}


export const getDayName = (day: number) => {

    switch (day) {

        case 1:
            return "ראשון";
        case 2:
            return "שני";
        case 3:
            return "שלישי";
        case 4:
            return "רביעי";
        case 5:
            return 'חמישי';
        case 6:
            return "שישי";
        case 7:
            return "שבת";
    }
}
