import React, { ChangeEvent } from 'react';
import { Year } from './DataDefinitions';

type Props = {
    years: Year[],
    selectedYear: Year | undefined,
    onSelectionChange: (event: ChangeEvent<HTMLSelectElement>) => void
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

const YearSelector = ({ years, selectedYear, onSelectionChange }: Props) => {
    const getYears = () => {
        return years.map(year => <option key={year} value={year}>{readable(year)}</option>)
    }
    return (
        <select value={selectedYear} onChange={onSelectionChange}>
            {getYears()}
        </select>
    );
};

export default YearSelector;