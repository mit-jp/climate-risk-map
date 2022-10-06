import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedMapVisualizations, toggleDataDescription } from './appSlice'
import { RootState } from './store'
import css from './DataDescription.module.css'

function DataDescription() {
    const dispatch = useDispatch()
    const showDataDescription = useSelector((state: RootState) => state.app.showDataDescription)
    const maps = useSelector(selectSelectedMapVisualizations)

    if (maps.length !== 1) {
        return null
    }
    const map = maps[0]
    const { description } = map
    const { displayName } = map

    if (!description) {
        return null
    }

    return (
        <div className={css.dataDescription}>
            <button
                type="button"
                onClick={() => dispatch(toggleDataDescription())}
                className={showDataDescription ? css.shown : undefined}
            >
                About the {displayName} data
            </button>
            {showDataDescription && <p>{description}</p>}
        </div>
    )
}

export default DataDescription
