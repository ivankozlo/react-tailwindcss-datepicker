import React from "react";

import { generateArrayNumber } from "../../helpers";

interface Props {
    selectedYear: number;
    startYear: number;
    clickYear: (data: number) => void;
}

const Years: React.FC<Props> = ({ selectedYear, startYear, clickYear }) => {
    return (
        <div className="w-full flex flex-row">
            {generateArrayNumber(startYear, startYear + 3).map((item, index) => (
                <div
                    key={index}
                    onClick={() => {
                        clickYear(item);
                    }}
                    className={`cursor-pointer text-[14px] select-none text-[#707070] p-2 font-[600] rounded-[6px] hover:bg-[#F7F7F7] ${
                        item === selectedYear ? "text-[#D81825]" : ""
                    }`}
                >
                    <>{item}</>
                </div>
            ))}
        </div>
    );
};

export default Years;
