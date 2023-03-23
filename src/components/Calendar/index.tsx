import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CALENDAR_SIZE } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import {
    formatDate,
    getDaysInMonth,
    getFirstDayInMonth,
    getFirstDaysInMonth,
    getLastDaysInMonth,
    getNumberOfDay,
    loadLanguageModule,
    nextMonth,
    previousMonth
} from "../../helpers";
import { ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon, ChevronRightIcon } from "../utils";

import Days from "./Days";
import Months from "./Months";
import Week from "./Week";
import Years from "./Years";

interface Props {
    date: dayjs.Dayjs;
    onClickPrevious: () => void;
    onClickNext: () => void;
    changeMonth: (month: number) => void;
    changeYear: (year: number) => void;
}

const Calendar: React.FC<Props> = ({
    date,
    onClickPrevious,
    onClickNext,
    changeMonth,
    changeYear
}) => {
    // Contexts
    const {
        period,
        changePeriod,
        changeDayHover,
        changeDatepickerValue,
        hideDatepicker,
        asSingle,
        i18n,
        startWeekOn,
        input
    } = useContext(DatepickerContext);
    loadLanguageModule(i18n);

    // States
    const [showMonths, setShowMonths] = useState(false);
    const [currentYear, setCurrentYear] = useState(date.year());
    const [startYear, setStartYear] = useState(date.year() - 3);
    // Functions
    const previous = useCallback(() => {
        return getLastDaysInMonth(
            previousMonth(date),
            getNumberOfDay(getFirstDayInMonth(date).ddd, startWeekOn)
        );
    }, [date, startWeekOn]);

    const current = useCallback(() => {
        return getDaysInMonth(formatDate(date));
    }, [date]);

    const next = useCallback(() => {
        return getFirstDaysInMonth(
            previousMonth(date),
            CALENDAR_SIZE - (previous().length + current().length)
        );
    }, [current, date, previous]);

    const clickMonth = useCallback(
        (month: number) => {
            setTimeout(() => {
                changeMonth(month);
                setShowMonths(!showMonths);
            }, 250);
        },
        [changeMonth, showMonths]
    );

    const clickYear = useCallback(
        (year: number) => {
            changeYear(year);
        },
        [changeYear]
    );

    const nextYear = useCallback((year: number) => {
        setStartYear(year + 1);
    }, []);
    const prevYear = useCallback((year: number) => {
        setStartYear(year - 1);
    }, []);

    const clickDay = useCallback(
        (day: number, month = date.month() + 1, year = date.year()) => {
            const fullDay = `${year}-${month}-${day}`;
            let newStart;
            let newEnd = null;

            function chosePeriod(start: string, end: string) {
                const ipt = input?.current;
                changeDatepickerValue(
                    {
                        startDate: dayjs(start).format("YYYY-MM-DD"),
                        endDate: dayjs(end).format("YYYY-MM-DD")
                    },
                    ipt
                );
                hideDatepicker();
            }

            if (period.start && period.end) {
                if (changeDayHover) {
                    changeDayHover(null);
                }
                changePeriod({
                    start: null,
                    end: null
                });
            }

            if ((!period.start && !period.end) || (period.start && period.end)) {
                if (!period.start && !period.end) {
                    changeDayHover(fullDay);
                }
                newStart = fullDay;
                if (asSingle) {
                    newEnd = fullDay;
                    chosePeriod(fullDay, fullDay);
                }
            } else {
                if (period.start && !period.end) {
                    // start not null
                    // end null
                    const condition =
                        dayjs(fullDay).isSame(dayjs(period.start)) ||
                        dayjs(fullDay).isAfter(dayjs(period.start));
                    newStart = condition ? period.start : fullDay;
                    newEnd = condition ? fullDay : period.start;
                } else {
                    // Start null
                    // End not null
                    const condition =
                        dayjs(fullDay).isSame(dayjs(period.end)) ||
                        dayjs(fullDay).isBefore(dayjs(period.end));
                    newStart = condition ? fullDay : period.start;
                    newEnd = condition ? period.end : fullDay;
                }
            }

            if (!(newEnd && newStart)) {
                changePeriod({
                    start: newStart,
                    end: newEnd
                });
            }
        },
        [
            asSingle,
            changeDatepickerValue,
            changeDayHover,
            changePeriod,
            date,
            hideDatepicker,
            period.end,
            period.start,
            input
        ]
    );

    const clickPreviousDays = useCallback(
        (day: number) => {
            const newDate = previousMonth(date);
            clickDay(day, newDate.month() + 1, newDate.year());
            onClickPrevious();
        },
        [clickDay, date, onClickPrevious]
    );

    const clickNextDays = useCallback(
        (day: number) => {
            const newDate = nextMonth(date);
            clickDay(day, newDate.month() + 1, newDate.year());
            onClickNext();
        },
        [clickDay, date, onClickNext]
    );

    // UseEffects & UseLayoutEffect
    useEffect(() => {
        setCurrentYear(date.year());
    }, [date]);

    // Variables
    const calendarData = useMemo(() => {
        return {
            date: date,
            days: {
                previous: previous(),
                current: current(),
                next: next()
            }
        };
    }, [current, date, next, previous]);

    return (
        <div className="w-full md:w-[297px] md:min-w-[297px]">
            <div className="flex items-center space-x-1.5 border-b border-[#DDDDDD] px-2 py-1.5">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full flex justify-center text-[20px] leading-[25px] select-none py-[5px] font-[600]">
                        {calendarData.date.locale(i18n).format("MMMM")}
                    </div>
                </div>
                <div className="absolute right-[20px] top-[29px]">
                    <div
                        onClick={() => {
                            setShowMonths(!showMonths);
                        }}
                        className="cursor-pointer"
                    >
                        {showMonths ? (
                            <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                        )}
                    </div>
                </div>
            </div>

            {showMonths ? (
                <div className="px-0.5 sm:px-2 min-h-[303px] flex items-center">
                    <Months clickMonth={clickMonth} />
                </div>
            ) : (
                <div className="px-0.5 sm:px-2 min-h-[295px]">
                    {!showMonths && (
                        <>
                            <Week />

                            <Days
                                calendarData={calendarData}
                                onClickPreviousDays={clickPreviousDays}
                                onClickDay={clickDay}
                                onClickNextDays={clickNextDays}
                            />
                        </>
                    )}
                </div>
            )}
            <div className="flex items-center border-t border-[#DDDDDD] px-2 py-1.5">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full flex justify-between leading-[25px] py-[10px]">
                        <div
                            onClick={() => {
                                prevYear(startYear);
                            }}
                            className="cursor-pointer"
                        >
                            <ChevronLeftIcon className="h-5 w-5 ml-[10px]" />
                        </div>
                        <div
                            onClick={() => {
                                nextYear(startYear);
                            }}
                            className="cursor-pointer"
                        >
                            <ChevronRightIcon className="h-5 w-5 mr-[10px]" />
                        </div>
                    </div>
                    <div className="absolute">
                        <Years
                            selectedYear={currentYear}
                            startYear={startYear}
                            clickYear={clickYear}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
