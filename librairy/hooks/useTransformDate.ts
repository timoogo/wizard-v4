import {DateAndTimeFormat, DateAndTimeFormatEnum, DateFormat, DateFormatEnum} from "@/librairy/types/DateFormat";

export const useTransformDate = (date: Date, format: DateFormat | DateAndTimeFormat): string => {
    if (format === DateFormatEnum.dayMonthYear) {
        // Format for 'dd-mm-yyyy'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } else if (format === DateFormatEnum.yearMonthDay) {
        // Format for 'yyyy-mm-dd'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    } else if (format === DateFormatEnum.yearMonthDaySlash) {
        // Format for 'yyyy/mm/dd'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}/${month}/${day}`;
    } else if (format === DateAndTimeFormatEnum.dayMonthYearHourMinuteSecond) {
        // Format for 'dd-mm-yyyy hh:mm:ss'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } else if (format === DateAndTimeFormatEnum.yearMonthDayHourMinuteSecond) {
        // Format for 'yyyy-mm-dd hh:mm:ss'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else if (format === DateAndTimeFormatEnum.yearMonthDaySlashHourMinuteSecond) {
        // Format for 'yyyy/mm/dd hh:mm:ss'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } else {
        throw new Error(`Unsupported date format: ${format}`);
    }
};


