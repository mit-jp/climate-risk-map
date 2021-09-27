import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import DataProcessor from "../DataProcessor";
import EmptyMap from "../EmptyMap";
import FullMap from "../FullMap";
import { useGetDataQuery } from "../MapApi";
import MapTitle, { EmptyMapTitle } from "../MapTitle";
import { getDataQueryParams, MapVisualization } from "../MapVisualization";
import { TopoJson } from "../TopoJson";

type Props = {
    map: TopoJson;
    selection: MapVisualization | undefined;
    detailedView: boolean;
}

const EditorMap = ({
    map,
    selection,
    detailedView,
}: Props) => {
    const queryParams = useMemo(
        () => selection
            ? getDataQueryParams(selection)
            : undefined,
        [selection]
    );
    const { data } = useGetDataQuery(queryParams ?? skipToken);
    const processedData = data && selection
        ? DataProcessor(data, [selection], {}, undefined, false)
        : undefined;

    return (
        <div id="map">
            {selection
                ? <MapTitle
                    selectedMapVisualizations={[selection]}
                    isNormalized={false} />
                : <EmptyMapTitle />
            }
            <svg viewBox="0, 0, 1175, 610">
                {processedData && selection
                    ? <FullMap
                        map={map}
                        selectedMapVisualizations={[selection]}
                        data={processedData}
                        detailedView={detailedView}
                        isNormalized={false}
                    />
                    : <EmptyMap map={map} />}
            </svg>
        </div>
    );
}

export default EditorMap;