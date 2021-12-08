import { MapVisualization } from "../MapVisualization";

const MapVisualizationList = ({ mapVisualizations, selectedId, onClick }:
    {
        mapVisualizations: MapVisualization[],
        selectedId?: number,
        onClick: (mapVisualization: MapVisualization) => void,
    }) => {
    return (
        <form id="data-selector">
            {mapVisualizations.map(map =>
                <div key={map.id}>
                    <input
                        className="data-group"
                        id={map.id.toString()}
                        checked={selectedId === map.id}
                        type="radio"
                        value={map.id}
                        onChange={() => onClick(map)}
                        name="dataGroup" />
                    <label className="data-group" htmlFor={map.id.toString()}>
                        {map.name}
                    </label>
                </div>
            )}
        </form>
    );
}

export const EmptyMapVisualizationList = () => <ol></ol>;
export default MapVisualizationList;
