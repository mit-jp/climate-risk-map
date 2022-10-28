import { Autocomplete, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
    County,
    CountyData,
    State,
    useGetCountiesQuery,
    useGetCountySummaryQuery,
    useGetStatesQuery,
} from '../MapApi'
import css from './ReportCard.module.css'

function SingleMetric({ data }: { data: CountyData }) {
    return (
        <tr className={css.countyMetric}>
            <td>{data.name}</td>
            <td>
                {Number(data.percentRank).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                })}
            </td>
            <td>{data.value}</td>
        </tr>
    )
}

function CountyReport({ county, state }: { county: County; state: State }) {
    const { data: countySummary } = useGetCountySummaryQuery({
        stateId: state.id,
        countyId: county.id,
        category: 8, // TODO: don't hardcode the category
    })
    return (
        <>
            <h2>
                County Report for: {county.name}, {state.name}
            </h2>
            <table className={css.countyMetrics}>
                <thead>
                    <tr>
                        <td>Metric</td>
                        <td>National Percentile</td>
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
        </>
    )
}

const fipsCode = (county: County) =>
    String(county.state).padStart(2, '0') + String(county.id).padStart(3, '0')

export default function ReportCard() {
    const params = useParams()
    const { data: counties } = useGetCountiesQuery(undefined)
    const { data: states } = useGetStatesQuery(undefined)

    const countyList = counties ? Object.values(counties) : []
    const selectedCounty = counties && params.countyId ? counties[params.countyId] : undefined
    const navigate = useNavigate()

    return (
        <>
            <h1>County Report Card</h1>
            <Autocomplete
                loading={countyList.length === 0 && !states}
                options={countyList}
                getOptionLabel={(county) =>
                    `${county.name}, ${states ? states[county.state].name : ''}`
                }
                renderInput={(p) => <TextField {...p} label="County" />}
                onChange={(_, county) => {
                    if (county) {
                        navigate(`/report-card/${fipsCode(county)}`, { replace: true })
                    }
                }}
            />
            {selectedCounty && states && (
                <CountyReport county={selectedCounty} state={states[selectedCounty.state]} />
            )}
        </>
    )
}
