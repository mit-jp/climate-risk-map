import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle from './MapTitle';
import { selectIsNormalized, selectMapVisualizations, selectProcessedData, selectSelectedMapVisualizations, selectSelections } from './appSlice';
import CountyTooltip from './CountyTooltip';
import MapControls from './MapControls';
import DataDescription from './DataDescription';
import Overlays from './Overlays';
import DataSourceDescription from './DataSourceDescription';

export const ZOOM_TRANSITION = { transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" };

const MapWrapper = () => {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const mapVisualizations = useSelector(selectMapVisualizations);
    const selections = useSelector(selectSelections);
    const map = useSelector((state: RootState) => state.app.map);
    const detailedView = useSelector((state: RootState) => state.app.detailedView);
    const processedData = useSelector(selectProcessedData);
    const isNormalized = useSelector(selectIsNormalized);

    if (map === undefined) {
        return <p>Loading</p>;
    }
    return (
        <div id="map">
            {
                processedData &&
                <MapTitle
                    selectedMapVisualizations={selectedMapVisualizations}
                    isNormalized={isNormalized} />
            }
            <svg viewBox="0, 0, 1175, 610">
                {processedData ?
                    <FullMap
                        map={map}
                        mapVisualizations={mapVisualizations}
                        selectedMapVisualizations={selectedMapVisualizations}
                        selections={selections}
                        data={processedData}
                        detailedView={detailedView}
                        isNormalized={isNormalized}
                    /> :
                    <EmptyMap map={map} />}
                <Overlays />
            </svg>
            {processedData && <CountyTooltip data={processedData} />}
            {map && <MapControls processedData={processedData} />}
            <DataDescription />
            <DataSourceDescription />
        </div>
    );
};

export default MapWrapper;
