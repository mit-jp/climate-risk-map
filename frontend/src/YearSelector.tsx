import React, { ChangeEvent } from 'react';
import { Interval } from 'luxon';

type Props = {
    years: Interval[],
    selectedYear: Interval,
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void,
    id: string,
};

const readable = (interval: Interval) => {
    if (interval.length('year') < 2) {
        return interval.start.year.toString();
    }
    else {
        return interval.start.year.toString() + '-' + interval.end.year.toString();
    }
}

const YearSelector = ({ years, selectedYear, onSelectionChange, id }: Props) => {
    const getYears = () => {
        return years.map(year =>
            <React.Fragment key={year.toISODate()}>
                <input
                    type="radio"
                    value={year.toISODate()}
                    id={id + year.toISODate()}
                    onChange={onSelectionChange}
                    checked={year.equals(selectedYear)}
                />
                <label htmlFor={id + year.toISODate()}>{readable(year)}</label>
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