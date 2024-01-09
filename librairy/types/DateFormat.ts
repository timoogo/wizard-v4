export type DateFormat = 'dd-mm-yyyy' | 'yyyy-mm-dd' | 'yyyy/mm/dd';
export type DateAndTimeFormat = 'dd-mm-yyyy hh:mm:ss' | 'yyyy-mm-dd hh:mm:ss' | 'yyyy/mm/dd hh:mm:ss';
export enum DateFormatEnum {
    dayMonthYear = 'dd-mm-yyyy',
    yearMonthDay = 'yyyy-mm-dd',
    yearMonthDaySlash = 'yyyy/mm/dd',
}
export enum DateAndTimeFormatEnum {
    dayMonthYearHourMinuteSecond = 'dd-mm-yyyy hh:mm:ss',
    yearMonthDayHourMinuteSecond = 'yyyy-mm-dd hh:mm:ss',
    yearMonthDaySlashHourMinuteSecond = 'yyyy/mm/dd hh:mm:ss',
}