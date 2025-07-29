import { Autocomplete, TextField, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { redBlueReportCard } from '../Color'
import { formatData } from '../Formatter'
import {
    County,
    PercentileRow,
    useGetCountiesQuery,
    useGetPercentilesQuery,
    useGetStatePercentilesQuery,
    useGetStatesQuery,
    useGetTabsQuery,
} from '../MapApi'
import { stateId } from '../appSlice'
import css from './ReportCard.module.css'

let showStatePercentiles = false
let StatePercentileData: PercentileRow[]

// gets the PercentileRow with the given name in StatePercentileData
function GetStatePercentileData(name: String) {
    return StatePercentileData.find((row) => row.name === name)
}

// generates the numerical percent value visual and percentile bar visual for the given value
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
                    style={{ width: `${value * 100}%`, background: redBlueReportCard(value) }}
                />
            </td>
        </>
    )
}

// generates an empty space for null data
function EmptyPercentile() {
    return <td colSpan={2} />
}

// generates a row of data in the table including the metric name, percentile visual, and raw value
function SingleMetric({ data }: { data: PercentileRow }) {
    return (
        <tr className={css.countyMetric}>
            <td className={css.metricColumn} width="25%">
                {data.name}
            </td>
            {data.percentRank == null ? (
                <EmptyPercentile />
            ) : (
                <Percentile value={data.percentRank} />
            )}

            {showStatePercentiles &&
                StatePercentileData &&
                GetStatePercentileData(data.name) === undefined && <EmptyPercentile />}

            {showStatePercentiles &&
                StatePercentileData &&
                GetStatePercentileData(data.name) !== undefined && (
                    <Percentile value={GetStatePercentileData(data.name)!.percentRank} />
                )}

            <td className={css.rawValColumn}>
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

// generates the table which contains the Report Card for the given county and data category
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
    const { data: countySummaryByState } = useGetStatePercentilesQuery({
        geoId,
        category,
        geographyType,
    })

    // if enabled, display the state-level percentile data
    if (showStatePercentiles && countySummaryByState) {
        StatePercentileData = Object.entries(countySummaryByState)
            .flat(1)
            .filter((e) => !(typeof e === 'string')) as PercentileRow[]
    }
    return (
        <table className={css.countyMetrics}>
            <thead>
                <tr>
                    <td>Metric</td>
                    <td colSpan={2}>National Percentile</td>
                    {showStatePercentiles && <td colSpan={2}>State Percentile</td>}
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

/**
 * County FIPS codes are 5 characters with 0s padded in the map,
 * so 1234 -> "01234"
 * @param county the county to get the FIPS code for
 * @returns FIPS code for the county
 */
const fipsCode = (county: County) => String(county.id).padStart(5, '0')

export default function ReportCard() {
    const [checked, setChecked] = useState(false)
    const handleChange = () => {
        setChecked(!checked)
        showStatePercentiles = !showStatePercentiles
    }
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
                    `${county.name}, ${states ? states[stateId(county.id)].name : ''}`
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
            <div id={css.statePercentileCheckbox}>
                <Checkbox checked={checked} onChange={handleChange} />
                Display state-level percentile data
            </div>
            {selectedRegion && states && categoryId !== undefined && (
                <PercentileReport
                    geoId={selectedRegion.id}
                    category={categoryId}
                    geographyType={1}
                />
            )}
        </div>
    )
}
