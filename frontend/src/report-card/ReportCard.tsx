import { Autocomplete, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
    County,
    State,
    useGetCountiesQuery,
    useGetCountySummaryQuery,
    useGetStatesQuery,
} from '../MapApi'

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
            {countySummary &&
                Object.entries(countySummary).map(([datasetId, data]) => (
                    <p key={datasetId}>
                        {data.name}: {data.percentRank}, {data.value}
                    </p>
                ))}
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
    const countyId = Number(params.countyId)
    const selectedCounty = counties ? counties[countyId] : undefined
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
