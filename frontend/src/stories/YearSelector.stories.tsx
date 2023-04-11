import { ComponentMeta } from '@storybook/react'
import { Interval } from 'luxon'
import FewYearSelector from '../YearSelector'

export default {
    title: 'YearSelector',
    component: FewYearSelector,
} as ComponentMeta<typeof FewYearSelector>

export const ThreeYears = () => {
    return (
        <FewYearSelector
            years={[
                Interval.fromISO('2020-01-01/2020-12-31'),
                Interval.fromISO('2021-01-01/2021-12-31'),
            ]}
            selectedYear={Interval.fromISO('2020-01-01/2020-12-31')}
            onChange={() => {}}
            id="year-selector"
        />
    )
}
