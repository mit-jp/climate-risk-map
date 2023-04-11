import { MenuItem, Select } from '@mui/material'
import { Interval } from 'luxon'
import { Fragment } from 'react'
import css from './SubSelector.module.css'

type Props = {
    years: Interval[]
    selectedYear: Interval
    onChange: (date: Interval) => void
    id: string
}

const readable = (interval: Interval) => {
    if (interval.length('year') < 2) {
        return interval.start.year.toString()
    }
    return `${interval.start.year.toString()}-${interval.end.year.toString()}`
}

function DropdownYearSelector({ years, selectedYear, onChange, id }: Props) {
    return (
        <div className={css.subSelector}>
            <p>Year:</p>
            <Select
                className={css.yearDropdown}
                value={selectedYear.toISODate()}
                onChange={(e) => onChange(Interval.fromISO(e.target.value))}
                id={id}
            >
                {years.map((year) => (
                    <MenuItem key={year.toISODate()} value={year.toISODate()}>
                        {readable(year)}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

function ButtonsYearSelector({ years, selectedYear, onChange, id }: Props) {
    const getYears = () => {
        return years.map((year) => (
            <Fragment key={year.toISODate()}>
                <input
                    type="radio"
                    value={year.toISODate()}
                    id={id + year.toISODate()}
                    onChange={(e) => onChange(Interval.fromISO(e.target.value))}
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

function YearSelector({ years, selectedYear, onChange, id }: Props) {
    if (years.length > 5) {
        return (
            <DropdownYearSelector
                years={years}
                selectedYear={selectedYear}
                onChange={onChange}
                id={id}
            />
        )
    }
    return (
        <ButtonsYearSelector
            years={years}
            selectedYear={selectedYear}
            onChange={onChange}
            id={id}
        />
    )
}

export default YearSelector
