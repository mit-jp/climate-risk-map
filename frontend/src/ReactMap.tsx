import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { feature, mesh } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import { geoPath } from 'd3';

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

    if (map === undefined) {
        return null;
    }

    const path = geoPath();
    const counties = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const countyPaths = counties.map(county => (
        <path
        key={county.id}
        // fill={color(county.properties.density)}
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

export default ReactMap;
