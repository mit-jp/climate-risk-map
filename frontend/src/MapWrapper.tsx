import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle from './MapTitle';
import { selectProcessedData, selectSelections } from './appSlice';
import CountyTooltip from './CountyTooltip';

const MapWrapper = () => {
    const selections = useSelector(selectSelections);
    const map = useSelector((state: RootState) => state.app.map);
    const detailedView = useSelector((state: RootState) => state.app.detailedView);
    const processedData = useSelector(selectProcessedData);

    if (map === undefined) {
        return <p>Loading</p>;
    }
    return (
        <div id="map">
            {processedData && <MapTitle selections={selections} />}
            <svg viewBox="0, 0, 1175, 610">
                {processedData ?
                    <FullMap
                        map={map}
                        selections={selections}
                        data={processedData}
                        detailedView={detailedView}
                    /> :
                    <EmptyMap map={map} />}
            </svg>
            {processedData && <CountyTooltip data={processedData} />}
        </div>
    );
};

export default MapWrapper;
