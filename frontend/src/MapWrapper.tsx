import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle from './MapTitle';
import { selectDataQueryParams, selectIsNormalized, selectSelectedMapVisualizations } from './appSlice';
import CountyTooltip from './CountyTooltip';
import MapControls from './MapControls';
import DataDescription from './DataDescription';
import Overlays from './Overlays';
import DataSourceDescription from './DataSourceDescription';
import { useGetDataQuery } from './MapApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import DataProcessor from './DataProcessor';
import randomColor from 'randomcolor';
import { Map } from 'immutable';
import Counties from './Counties';
import ChoroplethMap from './ChoroplethMap';

export const ZOOM_TRANSITION = { transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" };

const MapWrapper = () => {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const countyPaths = useSelector((state: RootState) => state.app.countyPaths);
    if (countyPaths === undefined) {
        return <p>Loading</p>;
    }
    return (
        <div id="map">
            <div id="empty-title"></div>
            <svg viewBox="0, 0, 1175, 610">
                <ChoroplethMap
                    countyPaths={countyPaths}
                    data={Map()}
                />
                <Overlays />
            </svg>
            {countyPaths && <MapControls processedData={Map()} />}
            <DataDescription />
            <DataSourceDescription />
        </div>
    );
};

export default MapWrapper;
