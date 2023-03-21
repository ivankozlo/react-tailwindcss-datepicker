import React, { useCallback, useContext, useEffect, useRef } from "react";
import { AiTwotoneCalendar } from "react-icons/ai";

import DatepickerContext from "../contexts/DatepickerContext";

type Props = {
    setContextRef?: (ref: React.RefObject<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = (e: Props) => {
    // Context
    const {
        calendarContainer,
        arrowContainer,
        inputText,
        disabled,
        inputClassName,
        readOnly,
        inputId,
        inputName,
        classNames,
        invalid,
        emptyLabel,
        fillLabel
    } = useContext(DatepickerContext);

    // UseRefs
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef && e.setContextRef && typeof e.setContextRef === "function") {
            e.setContextRef(inputRef);
        }
    }, [e, inputRef]);

    // Functions
    const getClassName = useCallback(() => {
        const input = inputRef.current;

        if (input && typeof classNames != "undefined" && typeof classNames.input === "function") {
            return classNames?.input(input);
        }
        const classNameOverload = typeof inputClassName === "string" ? inputClassName : "";
        return `relative p-[10px] pl-[50px] w-full rounded-[3px] tracking-wide font-light text-sm placeholder-gray-400
            border-[#C4C4C4] bg-white border-2
            focus:border-[#0493F2] focus:ring-0
            hover:border-[#0493F2] hover:border-2 hover:cursor-pointer hover:bg-[#F5FBFF]
            hover:disabled:border-[#C4C4C4] hover:disabled:bg-[#ffffff] hover:disabled:bg-[#F7F7F7] hover:disabled:border-[#DDDDDD]
            disabled:border-[#DDDDDD] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
            active:ring-0 active:border-[#0493F2] active:border-2
            ${invalid && "border-[#BF1521]"}
            ${classNameOverload}
        `;
    }, [classNames, inputClassName, invalid]);

    useEffect(() => {
        const div = calendarContainer?.current;
        const input = inputRef.current;

        function showCalendarContainer() {
            if (div && div.classList.contains("hidden")) {
                div.classList.remove("hidden");
                div.classList.add("block");
                // window.innerWidth === 767
                if (
                    window.innerWidth > 767 &&
                    window.screen.height - 100 < div.getBoundingClientRect().bottom
                ) {
                    div.classList.add("bottom-full");
                    div.classList.add("mb-2.5");
                    div.classList.remove("mt-2.5");
                }
                setTimeout(() => {
                    div.classList.remove("translate-y-4");
                    div.classList.remove("opacity-0");
                    div.classList.add("translate-y-0");
                    div.classList.add("opacity-1");
                }, 1);
            }
        }

        if (div && input) {
            input.addEventListener("focus", showCalendarContainer);
        }

        return () => {
            if (input) {
                input.removeEventListener("focus", showCalendarContainer);
            }
        };
    }, [calendarContainer, arrowContainer]);

    const showCalendar = useCallback(() => {
        const div = calendarContainer?.current;
        if (div && div.classList.contains("hidden")) {
            div.classList.remove("hidden");
            div.classList.add("block");
            // window.innerWidth === 767
            if (
                window.innerWidth > 767 &&
                window.screen.height - 100 < div.getBoundingClientRect().bottom
            ) {
                div.classList.add("bottom-full");
                div.classList.add("mb-2.5");
                div.classList.remove("mt-2.5");
            }
            setTimeout(() => {
                div.classList.remove("translate-y-4");
                div.classList.remove("opacity-0");
                div.classList.add("translate-y-0");
                div.classList.add("opacity-1");
            }, 1);
        }
    }, [calendarContainer]);

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                className={getClassName()}
                disabled={disabled}
                readOnly={readOnly}
                value={""}
                id={inputId}
                name={inputName}
                autoComplete="off"
                role="presentation"
                onChange={() => {
                    // Do nothing
                }}
            />
            <div
                onClick={() => {
                    if (!disabled) {
                        showCalendar();
                    }
                }}
                className="cursor-pointer"
            >
                <span
                    className={`absolute p-0 m-0 top-[7px] left-[15px] text-[30px] ${
                        disabled ? "text-[#C4C4C4]" : ""
                    }`}
                >
                    <AiTwotoneCalendar />
                </span>
                {emptyLabel && inputText === "" && (
                    <span
                        className={`absolute text-[15px] left-[52px] top-[10px] ${
                            disabled ? "text-[#C4C4C4]" : "text-[#8E8E8E]"
                        }`}
                    >
                        {emptyLabel}
                    </span>
                )}
                <div
                    className={`absolute flex flex-col top-0 text-[12px] left-[52px] ${
                        disabled ? "text-[#C4C4C4]" : "text-[#8E8E8E]"
                    }`}
                >
                    {fillLabel && inputText !== "" && <span className="mt-[1px]">{fillLabel}</span>}
                    <span className="text-[16px]">{inputText}</span>
                </div>
            </div>
        </div>
    );
};

export default Input;
