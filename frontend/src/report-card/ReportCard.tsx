import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { redBlue } from '../Color'
import { formatData } from '../Formatter'
import {
    County,
    CountySummaryRow,
    State,
    useGetCountiesQuery,
    useGetCountySummaryQuery,
    useGetStatesQuery,
    useGetTabsQuery,
} from '../MapApi'
import css from './ReportCard.module.css'

function Percentile({ value }: { value: number }) {
    return (
        <>
            <td className={css.percentileColumn}>
                {Number(value).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                })}
            </td>
            <td className={css.percentileBarColumn}>
                <div
                    className={css.percentileBar}
                    style={{ width: `${value * 100}%`, background: redBlue(value) }}
                />
            </td>
        </>
    )
}

function EmptyPercentile() {
    return <td colSpan={2} />
}

function SingleMetric({ data }: { data: CountySummaryRow }) {
    return (
        <tr className={css.countyMetric}>
            <td>{data.name}</td>
            {data.percentRank == null ? (
                <EmptyPercentile />
            ) : (
                <Percentile value={data.percentRank} />
            )}

            <td>
                {formatData(data.value, {
                    type: data.formatter_type,
                    decimals: data.decimals,
                    isNormalized: false,
                    units: data.units,
                })}
            </td>
        </tr>
    )
}

function CountyReport({
    category,
    county,
    state,
}: {
    category: number
    county: County
    state: State
}) {
    const { data: countySummary } = useGetCountySummaryQuery({
        stateId: state.id,
        countyId: county.id,
        category,
    })
    return (
        <table className={css.countyMetrics}>
            <thead>
                <tr>
                    <td>Metric</td>
                    <td colSpan={2}>National Percentile</td>
                    <td>Value</td>
                </tr>
            </thead>
            <tbody>
                {countySummary &&
                    Object.entries(countySummary).map(([datasetId, data]) => (
                        <SingleMetric key={datasetId} data={data} />
                    ))}
            </tbody>
        </table>
    )
}

const fipsCode = (county: County) =>
    String(county.state).padStart(2, '0') + String(county.id).padStart(3, '0')

export default function ReportCard() {
    const params = useParams()
    const { data: counties } = useGetCountiesQuery(undefined)
    const { data: states } = useGetStatesQuery(undefined)
    const { data: categories } = useGetTabsQuery(false)
    const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
    const countyList = counties ? Object.values(counties) : []
    const category = Number(params.category)
    const navigate = useNavigate()
    useEffect(() => {
        setSelectedCounty(counties && params.countyId ? counties[params.countyId] : null)
    }, [params, counties])

    return (
        <div className={css.reportCard}>
            <h1>
                County Report Card
                {categories &&
                    category !== undefined &&
                    `: ${categories.find((t) => t.id === category)?.name ?? ''}`}
            </h1>
            <Autocomplete
                loading={countyList.length === 0 && !states}
                options={countyList}
                getOptionLabel={(county) =>
                    `${county.name}, ${states ? states[county.state].name : ''}`
                }
                renderInput={(p) => <TextField {...p} label="County" />}
                onChange={(_, county) => {
                    if (county) {
                        navigate(`/report-card/${category}/${fipsCode(county)}`, { replace: true })
                    }
                }}
                value={selectedCounty}
            />
            {selectedCounty && states && category !== undefined && (
                <CountyReport
                    county={selectedCounty}
                    state={states[selectedCounty.state]}
                    category={category}
                />
            )}
        </div>
    )
}