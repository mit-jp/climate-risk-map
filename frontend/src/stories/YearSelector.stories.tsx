import { ComponentMeta } from '@storybook/react'
import { Interval } from 'luxon'
import YearSelector from '../YearSelector'

export default {
    title: 'YearSelector',
    component: YearSelector,
} as ComponentMeta<typeof YearSelector>

export const ThreeYears = () => {
    return (
        <YearSelector
            years={[
                Interval.fromISO('2020-01-01/2020-12-31'),
                Interval.fromISO('2021-01-01/2021-12-31'),
            ]}
            selectedYear={Interval.fromISO('2020-01-01/2020-12-31')}
            onSelectionChange={() => {}}
            id="year-selector"
        />
    )
}