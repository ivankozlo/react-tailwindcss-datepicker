import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useContext } from "react";

import { MONTHS } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import { loadLanguageModule } from "../../helpers";
import { RoundedButton } from "../utils";

interface Props {
    clickMonth: (month: number) => void;
}

const Months: React.FC<Props> = ({ clickMonth }) => {
    const { i18n, inputText } = useContext(DatepickerContext);
    loadLanguageModule(i18n);
    dayjs.extend(customParseFormat);
    return (
        <div className="w-full grid grid-cols-4 text-black min-h-[180px] gap-[10px]">
            {MONTHS.map(item => (
                <RoundedButton
                    key={item}
                    padding="py-3"
                    onClick={() => {
                        clickMonth(item);
                    }}
                    selected={
                        inputText
                            ? item - 1 === dayjs(inputText, "DD.MM.YYYY").month()
                            : item - 1 === dayjs().month()
                    }
                >
                    <>{dayjs(`2022-${item}-01`).locale(i18n).format("MMM")}</>
                </RoundedButton>
            ))}
        </div>
    );
};

export default Months;
