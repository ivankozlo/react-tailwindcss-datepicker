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
    const { period, changePeriod, changeDayHover, minDate, maxDate, disabledDates, accentColor } =
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
        const className = " hover:bg-[#F7F7F7]";
        return className;
    }, []);

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
        (day: number, type: string) => {
            const baseClass =
                "flex items-center justify-center w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] rounded-[6px]";
            return cn(
                baseClass,
                !activeDateData(day).active ? hoverClassByDay() : activeDateData(day).className,
                isDateDisabled(day, type) && "text-[#707070]"
            );
        },
        [activeDateData, hoverClassByDay, isDateDisabled]
    );

    const buttonStyles = useCallback(
        (day: number) => {
            const CUSTOM_BACKGROUND_STYLES = {
                color: "#FFFFFF",
                backgroundColor: accentColor,

                ":hover": {
                    backgroundColor: accentColor
                }
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
                return CUSTOM_TEXT_STYLES;
            } else {
                return {};
            }
        },
        [activeDateData, calendarData.date, accentColor]
    );

    const hoverDay = useCallback(
        (day: number, type: string) => {
            const object = {
                previous: previousMonth(calendarData.date),
                current: calendarData.date,
                next: nextMonth(calendarData.date)
            };
            const newDate = object[type as keyof typeof object];
            const newHover = `${newDate.year()}-${newDate.month() + 1}-${
                day >= 10 ? day : "0" + day
            }`;

            if (period.start && !period.end) {
                if (dayjs(newHover).isBefore(dayjs(period.start))) {
                    changePeriod({
                        start: null,
                        end: period.start
                    });
                }
                changeDayHover(newHover);
            }

            if (!period.start && period.end) {
                if (dayjs(newHover).isAfter(dayjs(period.end))) {
                    changePeriod({
                        start: period.end,
                        end: null
                    });
                }
                changeDayHover(newHover);
            }
        },
        [calendarData.date, changeDayHover, changePeriod, period.end, period.start]
    );

    return (
        <div className="grid grid-cols-7 gap-y-0.5 my-1">
            {calendarData.days.previous.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(item, "previous")}
                    className="flex items-center justify-center text-[14px] select-none text-[#707070] w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] hover:bg-[#F7F7F7] rounded-[6px]"
                    onClick={() => onClickPreviousDays(item)}
                    onMouseOver={() => {
                        hoverDay(item, "previous");
                    }}
                >
                    {item}
                </button>
            ))}

            {calendarData.days.current.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(item, "current")}
                    className={`text-[14px] text-[#1D1D1D] select-none ${buttonClass(
                        item,
                        "current"
                    )}`}
                    onClick={() => {
                        onClickDay(item);
                    }}
                    onMouseOver={() => {
                        hoverDay(item, "current");
                    }}
                    style={buttonStyles(item)}
                >
                    {item}
                </button>
            ))}

            {calendarData.days.next.map((item, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={isDateDisabled(index, "next")}
                    className="flex items-center text-[14px] justify-center text-[#707070] w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] select-none hover:bg-[#F7F7F7] rounded-[6px]"
                    onClick={() => {
                        onClickNextDays(item);
                    }}
                    onMouseOver={() => {
                        hoverDay(item, "next");
                    }}
                >
                    {item}
                </button>
            ))}
        </div>
    );
};

export default Days;
