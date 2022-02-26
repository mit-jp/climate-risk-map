import { MapVisualization } from '../MapVisualization'
import css from '../DataSelector.module.css'

function MapVisualizationList({
    mapVisualizations,
    selectedId,
    onClick,
}: {
    mapVisualizations: MapVisualization[]
    selectedId?: number
    onClick: (mapVisualization: MapVisualization) => void
}) {
    return (
        <form id={css.dataSelector}>
            {mapVisualizations.map((map) => (
                <div key={map.id}>
                    <input
                        className={css.dataGroup}
                        id={map.id.toString()}
                        checked={selectedId === map.id}
                        type="radio"
                        value={map.id}
                        onChange={() => onClick(map)}
                        name="dataGroup"
                    />
                    <label className={css.dataGroup} htmlFor={map.id.toString()}>
                        {map.displayName}
                    </label>
                </div>
            ))}
        </form>
    )
}

export function EmptyMapVisualizationList() {
    return <div id={css.dataSelector} />
}
export default MapVisualizationList
