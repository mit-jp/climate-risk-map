import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { redBlue } from '../Color'
import { formatData } from '../Formatter'
import {
    County,
    PercentileRow,
    useGetCountiesQuery,
    useGetPercentilesQuery,
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

function SingleMetric({ data }: { data: PercentileRow }) {
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

function PercentileReport({
    category,
    geoId,
    geographyType,
}: {
    category: number
    geoId: number
    geographyType: number
}) {
    const { data: countySummary } = useGetPercentilesQuery({
        geoId,
        category,
        geographyType,
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
    const [selectedRegion, setSelectedRegion] = useState<County | null>(null)
    const countyList = counties ? Object.values(counties) : []
    const categoryId = Number(params.category)
    const navigate = useNavigate()
    useEffect(() => {
        setSelectedRegion(
            counties && Number(params.countyId) ? counties[Number(params.countyId)] : null
        )
    }, [params, counties])

    return (
        <div className={css.reportCard}>
            <h1>
                County Report Card
                {categories &&
                    categoryId !== undefined &&
                    `: ${categories[categoryId]?.name ?? ''}`}
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
                        navigate(`/report-card/${categoryId}/${fipsCode(county)}`, {
                            replace: true,
                        })
                    }
                }}
                value={selectedRegion}
            />
            {selectedRegion && states && categoryId !== undefined && (
                <PercentileReport
                    geoId={selectedRegion.state * 1000 + selectedRegion.id}
                    category={categoryId}
                    geographyType={1}
                />
            )}
        </div>
    )
}
