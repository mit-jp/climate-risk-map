import { useParams } from 'react-router-dom'

export default function ReportCard() {
    const params = useParams()
    return <p>report card: {params.countyId && <b>{params.countyId}</b>}</p>
}
