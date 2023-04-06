import React, { useCallback, useContext, useEffect, useRef } from "react";

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
        return `relative p-[10px] pl-[40px] w-full h-[40px] rounded-[3px] tracking-wide font-light text-sm placeholder-gray-400
            border-[#C4C4C4] bg-white 
            focus:border-[#0493F2] focus:ring-0
            hover:border-[#0493F2] hover:border-2 hover:cursor-pointer hover:bg-[#F5FBFF]
            hover:disabled:border-[#C4C4C4] hover:disabled:border-[#DDDDDD]
            disabled:border-[#DDDDDD] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
            active:ring-0 active:border-[#0493F2] active:border-2
            ${invalid && "border-[#BF1521]"}
            ${classNameOverload}
        `;
    }, [classNames, inputClassName, invalid]);

    const getTextClassName = useCallback(() => {
        const regex = /\btext\S*\b/g;
        const classNameOverload = typeof inputClassName === "string" ? inputClassName : "";
        const matches = inputClassName ? classNameOverload.match(regex) : "";
        return matches ? matches.join(" ") : "";
    }, [inputClassName]);
    const getIconClassName = useCallback(() => {
        const regex = /\bfill\S*\b/g;
        const classNameOverload = typeof inputClassName === "string" ? inputClassName : "";
        const matches = inputClassName ? classNameOverload.match(regex) : "";
        return matches ? matches.join(" ") : "";
    }, [inputClassName]);

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
                style={
                    invalid
                        ? {
                              borderColor: "#BF1521"
                          }
                        : {}
                }
            />
            <div
                onClick={() => {
                    if (!disabled) {
                        showCalendar();
                    }
                }}
                className="cursor-pointer pointer-events-none"
            >
                <span
                    className={`absolute p-0 m-0 top-[10px] left-[17px] ${
                        disabled ? "text-[#C4C4C4]" : ""
                    }`}
                >
                    {disabled ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_739_2102)">
                                <path
                                    d="M16.6667 2.50004H15.8334V0.833374H14.1667V2.50004H5.83342V0.833374H4.16675V2.50004H3.33341C2.41675 2.50004 1.66675 3.25004 1.66675 4.16671V17.5C1.66675 18.4167 2.41675 19.1667 3.33341 19.1667H16.6667C17.5834 19.1667 18.3334 18.4167 18.3334 17.5V4.16671C18.3334 3.25004 17.5834 2.50004 16.6667 2.50004ZM16.6667 17.5H3.33341V6.66671H16.6667V17.5Z"
                                    fill="#C4C4C4"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_739_2102">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={getIconClassName() ? getIconClassName() : "fill-[#4F4F4F]"}
                        >
                            <g clipPath="url(#clip0_739_2084)">
                                <path d="M16.6667 2.50004H15.8334V0.833374H14.1667V2.50004H5.83342V0.833374H4.16675V2.50004H3.33341C2.41675 2.50004 1.66675 3.25004 1.66675 4.16671V17.5C1.66675 18.4167 2.41675 19.1667 3.33341 19.1667H16.6667C17.5834 19.1667 18.3334 18.4167 18.3334 17.5V4.16671C18.3334 3.25004 17.5834 2.50004 16.6667 2.50004ZM16.6667 17.5H3.33341V6.66671H16.6667V17.5Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_739_2084">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                </span>
                {emptyLabel && inputText === "" && (
                    <span
                        className={`absolute text-[12px] left-[44px] top-[11px] ${
                            disabled ? "text-[#C4C4C4]" : getTextClassName()
                        }`}
                    >
                        {emptyLabel}
                    </span>
                )}
                <div
                    className={`absolute flex flex-col top-0 text-[12px] left-[44px] ${
                        disabled ? "text-[#C4C4C4]" : getTextClassName()
                    }`}
                >
                    {fillLabel && inputText !== "" && (
                        <>
                            <span className="absolute top-[2px] leading-[15px]">{fillLabel}</span>
                            <span className="absolute top-[16px] text-[15px] font-[400]">
                                {inputText}
                            </span>
                        </>
                    )}
                    {!fillLabel && inputText !== "" && (
                        <>
                            <span className="absolute top-[9px] text-[15px] font-[400]">
                                {inputText}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Input;
