import React from 'react';
import DataProcessor from './DataProcessor';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle from './MapTitle';

const MapWrapper = () => {
    const {
        selections,
        map,
        data,
        dataWeights,
        state,
        detailedView,
    } = useSelector((state: RootState) => ({
        ...state.app,
        selections: state.app.dataSelections[state.app.dataTab] ?? [],
    }));
    if (map === undefined) {
        return <p>Loading</p>;
    }
    const processedData = DataProcessor(data, selections, dataWeights, state);
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
        </div>
    );
};

export default MapWrapper;
