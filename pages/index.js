import dayjs from "dayjs";
import { useState } from "react";

import Datepicker from "../src";

export default function Playground() {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const [primaryColor] = useState("red");
    const [useRange] = useState(false);
    const [showFooter] = useState(true);
    const [showShortcuts] = useState(false);
    const [asSingle] = useState(true);
    const [placeholder] = useState("");
    const [separator] = useState("~");
    const [i18n] = useState("en");
    const [disabled] = useState(false);
    const [inputClassName] = useState("bg-white");
    const [containerClassName] = useState("");
    const [toggleClassName] = useState("");
    const [displayFormat] = useState("DD.MM.YYYY");
    const [readOnly] = useState(false);
    const [minDate] = useState("");
    const [maxDate] = useState("");
    const [disabledDates] = useState([]);
    const [startFrom] = useState(dayjs());
    const [startWeekOn] = useState("mon");

    const handleChange = (value, e) => {
        setValue(value);
        console.log(e);
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
                    primaryColor={primaryColor}
                    onChange={handleChange}
                    useRange={useRange}
                    showFooter={showFooter}
                    showShortcuts={showShortcuts}
                    asSingle={asSingle}
                    placeholder={placeholder}
                    separator={separator}
                    startFrom={
                        startFrom.length && dayjs(startFrom).isValid() ? new Date(startFrom) : null
                    }
                    i18n={i18n}
                    disabled={disabled}
                    inputClassName={inputClassName}
                    containerClassName={containerClassName}
                    toggleClassName={toggleClassName}
                    displayFormat={displayFormat}
                    readOnly={readOnly}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={disabledDates}
                    startWeekOn={startWeekOn}
                    toggleIcon={isEmpty => {
                        return isEmpty ? "Select Date" : "Clear";
                    }}
                    classNames={"bg-white"}
                    invalid={false}
                    invalidText={"Please specify the details"}
                    emptyLabel={"Of"}
                    fillLabel={"By"}
                />
            </div>
        </div>
    );
}
