import dayjs from "dayjs";
import { useState } from "react";

import Datepicker from "../src";

export default function Playground() {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const [accentColor] = useState("#AA00CC");
    const [useRange] = useState(false);
    const [showShortcuts] = useState(false);
    const [asSingle] = useState(true);
    const [placeholder] = useState("");
    const [separator] = useState("~");
    const [i18n] = useState("en");
    const [disabled] = useState(false);
    const [inputClassName] = useState("fill-[#000]");
    const [containerClassName] = useState("");
    const [toggleClassName] = useState("");
    const [displayFormat] = useState("DD.MM.YYYY");
    const [readOnly] = useState(true);
    const [minDate] = useState("2023-05-3");
    const [maxDate] = useState("2023-05-22");
    const [disabledDates] = useState([]);
    const [startWeekOn] = useState("mon");

    const handleChange = value => {
        setValue(value);
        console.log("value", value);
    };
    return (
        <div className="px-4 py-8">
            <h1 className="text-center font-semibold text-xl">
                <span className="text-gray-700">FrontOffice Datepicker</span>
            </h1>

            <div className="max-w-md mx-auto my-4">
                <Datepicker
                    value={value}
                    accentColor={accentColor}
                    invalidColor={"#000"}
                    onChange={handleChange}
                    useRange={useRange}
                    showShortcuts={showShortcuts}
                    asSingle={asSingle}
                    placeholder={placeholder}
                    separator={separator}
                    i18n={i18n}
                    disabled={false}
                    inputClassName={"fill-[#000]"}
                    containerClassName={containerClassName}
                    toggleClassName={toggleClassName}
                    displayFormat={displayFormat}
                    readOnly={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={disabledDates}
                    startWeekOn={startWeekOn}
                    toggleIcon={isEmpty => {
                        return isEmpty ? "Select Date" : "Clear";
                    }}
                    classNames={"bg-red"}
                    invalid={true}
                    invalidText={"Please specify the sdsddds"}
                />
            </div>
        </div>
    );
}
