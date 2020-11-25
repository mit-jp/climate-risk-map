import React, { ChangeEvent } from 'react';
import { Year } from './DataDefinitions';

type Props = {
    years: Year[],
    selectedYear: Year | undefined,
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void,
    id: string,
};

const readable = (year: Year) => {
    switch(year) {
        case Year._2000_2019:
            return "2000-2019";
        case Year._1980_2019:
            return "1980-2019";
        case Year._1980_1999:
            return "1980-1999";
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