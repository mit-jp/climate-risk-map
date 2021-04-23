import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { feature, mesh } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import { geoPath } from 'd3';
import DataProcessor from './DataProcessor';
import Color from './Color';


const ReactMap = () => {
    const {
        selections,
        roadMap,
        showRoads,
        railroadMap,
        showRailroads,
        waterwayMap,
        showWaterways,
        map,
        data,
        dataWeights,
        state,
        detailedView,
    } = useSelector((state: RootState) => ({
        ...state.app,
        selections: state.app.dataSelections[state.app.dataTab] ?? [],
    }));

    if (selections.length === 0) {
        return null;
    }

    const processedData = DataProcessor(data, selections, dataWeights, state);
    const colorScheme = Color(selections, detailedView);

    if (map === undefined || processedData === undefined) {
        return null;
    }

    const path = geoPath();
    const counties = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const color = (countyId: string) => {
        const value = processedData.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const countyPaths = counties.map(county => (
        <path
            key={county.id}
            fill={color(county.id as string)}
            d={path(county)!}
        />
    ));

    return (
        <div id="map">
            {map &&
                <svg viewBox="0, 0, 1175, 610">
                    <g className="counties">
                        {countyPaths}
                    </g>
                </svg>
            }
        </div>
    );
};

const MISSING_DATA_COLOR = "#ccc";

export default ReactMap;
