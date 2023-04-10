import { Link } from 'react-router-dom'
import css from '../DataSelector.module.css'
import { useDeleteTabMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'

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
export function SkeletonMapVisualizationList() {
    return <div id={css.dataSelector} />
}

export function EmptyMapVisualizationList({ tabId }: { tabId: number }) {
    const [deleteTab] = useDeleteTabMutation()

    return (
        <div id={css.dataSelector}>
            <div className={css.actions}>
                <Link to="/editor/-1" className={css.publishLink}>
                    Publish a draft
                </Link>

                <button type="button" className={css.deleteTab} onClick={() => deleteTab(tabId)}>
                    delete this tab
                </button>
            </div>
        </div>
    )
}
export default MapVisualizationList
