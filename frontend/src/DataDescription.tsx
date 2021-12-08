import { useSelector } from 'react-redux';
import { selectSelectedMapVisualizations, toggleDataDescription } from './appSlice';
import { useThunkDispatch } from './Home';
import { RootState } from './store';

const DataDescription = () => {
    const dispatch = useThunkDispatch();
    const showDataDescription = useSelector((state: RootState) => state.app.showDataDescription);
    const maps = useSelector(selectSelectedMapVisualizations);

    if (maps.length !== 1) {
        return null;
    }
    const map = maps[0];
    const description = map.description;
    const name = map.name;

    if (!description) {
        return null;
    }

    return <div id="description">
        <button
            onClick={() => dispatch(toggleDataDescription())}
            className={showDataDescription ? "shown" : undefined}>
            About the {name} data
        </button>
        {showDataDescription && <p>{description}</p>}
    </div>
}

export default DataDescription;
