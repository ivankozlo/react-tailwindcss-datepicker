import React, { useContext } from "react";

import { generateArrayNumber } from "../../helpers";

import DatepickerContext from "contexts/DatepickerContext";

interface Props {
    selectedYear: number;
    startYear: number;
    clickYear: (data: number) => void;
}

const Years: React.FC<Props> = ({ selectedYear, startYear, clickYear }) => {
    const { primaryColor } = useContext(DatepickerContext);
    const SELECTED_YEAR_STYLE = {
        color: primaryColor
    };
    return (
        <div className="w-full flex flex-row">
            {generateArrayNumber(startYear, startYear + 3).map((item, index) => (
                <div
                    key={index}
                    onClick={() => {
                        clickYear(item);
                    }}
                    className={
                        "cursor-pointer text-[14px] select-none text-[#707070] p-2 font-[600] rounded-[6px] hover:bg-[#F7F7F7]"
                    }
                    style={item === selectedYear ? SELECTED_YEAR_STYLE : {}}
                >
                    <>{item}</>
                </div>
            ))}
        </div>
    );
};

export default Years;
