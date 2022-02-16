import { ChangeEvent, Fragment } from 'react'
import { Interval } from 'luxon'
import css from './SubSelector.module.css'

type Props = {
    years: Interval[]
    selectedYear: Interval
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void
    id: string
}

const readable = (interval: Interval) => {
    if (interval.length('year') < 2) {
        return interval.start.year.toString()
    }
    return `${interval.start.year.toString()}-${interval.end.year.toString()}`
}

function YearSelector({ years, selectedYear, onSelectionChange, id }: Props) {
    const getYears = () => {
        return years.map((year) => (
            <Fragment key={year.toISODate()}>
                <input
                    type="radio"
                    value={year.toISODate()}
                    id={id + year.toISODate()}
                    onChange={onSelectionChange}
                    checked={year.equals(selectedYear)}
                />
                <label htmlFor={id + year.toISODate()}>{readable(year)}</label>
            </Fragment>
        ))
    }
    return (
        <div className={css.subSelector}>
            <p>Year:</p>
            {getYears()}
        </div>
    )
}

export default YearSelector
