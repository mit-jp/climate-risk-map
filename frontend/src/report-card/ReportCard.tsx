import { Autocomplete, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { County, useGetCountiesQuery } from '../MapApi'

function CountyReport({ county }: { county: County }) {
    return <h2>County Report for: {county.name}</h2>
}

const fipsCode = (county: County) =>
    String(county.state).padStart(2, '0') + String(county.id).padStart(3, '0')

export default function ReportCard() {
    const params = useParams()
    const { data: counties } = useGetCountiesQuery(undefined)
    const countyList = counties ? Object.values(counties) : []
    const countyId = Number(params.countyId)
    const selectedCounty = counties ? counties[countyId] : undefined
    const navigate = useNavigate()

    return (
        <>
            <h1>County Report Card</h1>
            <Autocomplete
                loading={countyList.length === 0}
                options={countyList}
                getOptionLabel={(county) => `${county.name}, ${county.state}`}
                renderInput={(p) => <TextField {...p} label="County" />}
                onChange={(_, county) => {
                    if (county) {
                        navigate(`/report-card/${fipsCode(county)}`, { replace: true })
                    }
                }}
            />
            {selectedCounty && <CountyReport county={selectedCounty} />}
        </>
    )
}
