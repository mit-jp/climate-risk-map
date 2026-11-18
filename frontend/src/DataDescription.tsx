import { DataSource } from './MapVisualization'

function DataDescription({
    description,
    dataSource,
}: {
    description: string
    dataSource?: DataSource
}) {
    return (
        <details>
            <summary>About the data</summary>
            <p>{description}</p>
            {dataSource && (
                <>
                    <h4>Source: {dataSource.name}</h4>
                    <p>{dataSource.description}</p>
                    <p>
                        <a href={dataSource.link}>{dataSource.name} website</a>
                    </p>
                </>
            )}
        </details>
    )
}

export default DataDescription
