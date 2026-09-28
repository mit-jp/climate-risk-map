import css from './LandingPage.module.css'

interface RiskScoreRow {
    county: string
    povertyLevel: string
    povertyPercentile: number
    heatRisk: number
    heatPercentile: number
    combinedRiskScore: number
}

const sampleRows: RiskScoreRow[] = [
    {
        county: 'A',
        povertyLevel: '8%',
        povertyPercentile: 60,
        heatRisk: 32,
        heatPercentile: 80,
        combinedRiskScore: 70,
    },
    {
        county: 'B',
        povertyLevel: '12%',
        povertyPercentile: 80,
        heatRisk: 21,
        heatPercentile: 20,
        combinedRiskScore: 50,
    },
    {
        county: 'C',
        povertyLevel: '13.5%',
        povertyPercentile: 100,
        heatRisk: 22,
        heatPercentile: 40,
        combinedRiskScore: 70,
    },
    {
        county: 'D',
        povertyLevel: '4%',
        povertyPercentile: 40,
        heatRisk: 23,
        heatPercentile: 60,
        combinedRiskScore: 50,
    },
    {
        county: 'E',
        povertyLevel: '3.9%',
        povertyPercentile: 20,
        heatRisk: 33,
        heatPercentile: 100,
        combinedRiskScore: 60,
    },
]

function RRSCalcTable() {
    return (
        <table className={css.rrsTable}>
            <thead>
                <tr>
                    <th>County</th>
                    <th>Poverty Level (%)</th>
                    <th>Poverty Level Percentile (relative risk)</th>
                    <th>Heat Risk (°C)</th>
                    <th>Heat Risk Percentile (relative risk)</th>
                    <th>Combined Risk Score - Equal Weighting</th>
                </tr>
            </thead>
            <tbody>
                {sampleRows.map((row) => (
                    <tr key={row.county}>
                        <td>{row.county}</td>
                        <td>{row.povertyLevel}</td>
                        <td>{row.povertyPercentile}</td>
                        <td>{row.heatRisk}</td>
                        <td>{row.heatPercentile}</td>
                        <td>{row.combinedRiskScore}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default RRSCalcTable
