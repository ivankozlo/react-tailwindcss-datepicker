import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useCallback, useContext } from "react";

import DatepickerContext from "../../contexts/DatepickerContext";
import { formatDate, nextMonth, previousMonth, classNames as cn } from "../../helpers";
dayjs.extend(isBetween);

interface Props {
    calendarData: {
        date: dayjs.Dayjs;
        days: {
            previous: number[];
            current: number[];
            next: number[];
        };
    };
    onClickPreviousDays: (day: number) => void;
    onClickDay: (day: number) => void;
    onClickNextDays: (day: number) => void;
}

const Days: React.FC<Props> = ({
    calendarData,
    onClickPreviousDays,
    onClickDay,
    onClickNextDays
}) => {
    // Contexts
    const { period, minDate, maxDate, disabledDates, accentColor, calendarColors } =
        useContext(DatepickerContext);

    const activeDateData = useCallback(
        (day: number) => {
            const fullDay = `${calendarData.date.year()}-${calendarData.date.month() + 1}-${day}`;
            const className = "text-white font-medium rounded-[6px]";

            return {
                active: dayjs(fullDay).isSame(period.start) || dayjs(fullDay).isSame(period.end),
                className: className
            };
        },
        [calendarData.date, period.end, period.start]
    );

    const hoverClassByDay = useCallback(() => {
        const className = calendarColors?.hoverBgClass;
        return className;
    }, [calendarColors?.hoverBgClass]);

    const isDateTooEarly = useCallback(
        (day: number, type: string) => {
            if (!minDate) {
                return false;
            }
            const object = {
                previous: previousMonth(calendarData.date),
                current: calendarData.date,
                next: nextMonth(calendarData.date)
            };
            const newDate = object[type as keyof typeof object];
            const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
                day >= 10 ? day : "0" + day
            }`;
            return dayjs(formattedDate).isSame(dayjs(minDate))
                ? false
                : dayjs(formattedDate).isBefore(dayjs(minDate));
        },
        [calendarData.date, minDate]
    );

    const isDateTooLate = useCallback(
        (day: number, type: string) => {
            if (!maxDate) {
                return false;
            }
            const object = {
                previous: previousMonth(calendarData.date),
                current: calendarData.date,
                next: nextMonth(calendarData.date)
            };
            const newDate = object[type as keyof typeof object];
            const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
                day >= 10 ? day : "0" + day
            }`;
            return dayjs(formattedDate).isSame(maxDate)
                ? false
                : dayjs(formattedDate).isAfter(dayjs(maxDate));
        },
        [calendarData.date, maxDate]
    );

    const isDateDisabled = useCallback(
        (day: number, type: string) => {
            if (isDateTooEarly(day, type) || isDateTooLate(day, type)) {
                return true;
            }
            const object = {
                previous: previousMonth(calendarData.date),
                current: calendarData.date,
                next: nextMonth(calendarData.date)
            };
            const newDate = object[type as keyof typeof object];
            const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
                day >= 10 ? day : "0" + day
            }`;

            if (!disabledDates || (Array.isArray(disabledDates) && !disabledDates.length)) {
                return false;
            }

            let matchingCount = 0;
            disabledDates?.forEach(dateRange => {
                if (
                    dayjs(formattedDate).isAfter(dateRange.startDate) &&
                    dayjs(formattedDate).isBefore(dateRange.endDate)
                ) {
                    matchingCount++;
                }
                if (
                    dayjs(formattedDate).isSame(dateRange.startDate) ||
                    dayjs(formattedDate).isSame(dateRange.endDate)
                ) {
                    matchingCount++;
                }
            });
            return matchingCount > 0;
        },
        [calendarData.date, isDateTooEarly, isDateTooLate, disabledDates]
    );

    const buttonClass = useCallback(
        (day: number) => {
            const baseClass =
                "flex items-center justify-center w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] rounded-[6px]";
            return cn(
                baseClass,
                !activeDateData(day).active ? hoverClassByDay() : activeDateData(day).className
            );
        },
        [activeDateData, hoverClassByDay]
    );

    const buttonStyles = useCallback(
        (day: number, type: string) => {
            const CUSTOM_BACKGROUND_STYLES = {
                color: calendarColors?.activeText,
                backgroundColor: accentColor
            };
            const CUSTOM_TEXT_STYLES = {
                color: accentColor
            };
            const itemDate = `${calendarData.date.year()}-${calendarData.date.month() + 1}-${
                day >= 10 ? day : "0" + day
            }`;
            if (activeDateData(day).active) {
                return CUSTOM_BACKGROUND_STYLES;
            } else if (formatDate(dayjs()) === formatDate(dayjs(itemDate))) {
                // Today
                return CUSTOM_TEXT_STYLES;
            } else if (isDateDisabled(day, type)) {
                return {
                    color: calendarColors?.disabled
                };
            } else {
                return { color: calendarColors?.text };
            }
        },
        [
            calendarColors?.activeText,
            calendarColors?.disabled,
            calendarColors?.text,
            accentColor,
            calendarData.date,
            activeDateData,
            isDateDisabled
        ]
    );

    return (
        <div className="grid grid-cols-7 gap-y-0.5 my-1">
            {calendarData.days.previous.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(item, "previous")}
                    className={`flex items-center justify-center text-[14px] select-none w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] rounded-[6px] ${calendarColors?.hoverBgClass}`}
                    onClick={() => onClickPreviousDays(item)}
                    style={{ color: calendarColors?.otherMonth }}
                >
                    {item}
                </button>
            ))}

            {calendarData.days.current.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(item, "current")}
                    className={`text-[14px] select-none ${buttonClass(item)}`}
                    onClick={() => {
                        onClickDay(item);
                    }}
                    style={buttonStyles(item, "current")}
                >
                    {item}
                </button>
            ))}

            {calendarData.days.next.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(index, "next")}
                    className={`flex items-center text-[14px] justify-center w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] select-none rounded-[6px] ${calendarColors?.hoverBgClass}`}
                    onClick={() => {
                        onClickNextDays(item);
                    }}
                    style={{
                        color: calendarColors?.otherMonth
                    }}
                >
                    {item}
                </button>
            ))}
        </div>
    );
};

export default Days;
