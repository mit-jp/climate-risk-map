import React, { ChangeEvent } from 'react';
import { Year } from './DataDefinitions';

type Props = {
    years: Year[],
    selectedYear: Year | undefined,
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void,
    id: string,
};


// Externally-visible signature
function throwBadYear(year: never): never;
// Implementation signature
function throwBadYear(year: Year) {
    throw new Error('Unknown year: ' + year);
}

const readable = (year: Year) => {
    switch(year) {
        case Year._2000_2019: return "2000-2019";
        case Year._1980_2019: return "1980-2019";
        case Year._1980_1999: return "1980-1999";
        case Year._1995: return "1995";
        case Year._2000: return "2000";
        case Year._2005: return "2005";
        case Year._2010: return "2010";
        case Year._2015: return "2015";
        case Year.Average: return "Average";
        case Year._2017: return "2017";
        case Year._1982: return '1982';
        default: throwBadYear(year);
    }
}

const YearSelector = ({ years, selectedYear, onSelectionChange, id }: Props) => {
    const getYears = () => {
        return years.map(year =>
            <React.Fragment key={year}>
            <input
                type="radio"
                value={year}
                id={id + year}
                onChange={onSelectionChange}
                checked={year === selectedYear}
            />
            <label htmlFor={id + year}>{readable(year)}</label>
            </React.Fragment>
        )
    }
    return (
        <div className="sub-selector">
            <p>Year:</p>
            {getYears()}
        </div>
    );
};

export default YearSelector;