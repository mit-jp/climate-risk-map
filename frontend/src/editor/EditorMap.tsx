import { useMemo } from "react";
import DataProcessor from "../DataProcessor";
import EmptyMap from "../EmptyMap";
import FullMap from "../FullMap";
import { DataQueryParams, useGetDataQuery } from "../MapApi";
import MapTitle from "../MapTitle";
import { getDataQueryParams, MapVisualization } from "../MapVisualization";
import { TopoJson } from "../TopoJson";

type Props = {
    map: TopoJson;
    selection: MapVisualization;
    detailedView: boolean;
    isNormalized: boolean;
    queryParams: DataQueryParams[];
}

const EditorMap = ({
    map,
    selection,
    detailedView,
    isNormalized,
}: Props) => {
    const queryParams = useMemo(() => getDataQueryParams(selection), [selection]);
    const { data } = useGetDataQuery(queryParams);
    const processedData = data && selection
        ? DataProcessor(data, [selection], {}, undefined, false)
        : undefined;

    return (
        <div id="map">
            <MapTitle
                selectedMapVisualizations={[selection]}
                isNormalized={isNormalized} />
            <svg viewBox="0, 0, 1175, 610">
                {processedData ? <FullMap
                    map={map}
                    selectedMapVisualizations={[selection]}
                    data={processedData}
                    detailedView={detailedView}
                    isNormalized={isNormalized}
                />
                    : <EmptyMap map={map} />}
            </svg>
        </div>
    );
}

export default EditorMap;