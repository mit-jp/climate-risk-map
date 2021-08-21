import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle from './MapTitle';
import { CountyId, Data, DataByDataset, selectIsNormalized, selectMapVisualizations, selectProcessedData, selectSelectedMapVisualizations, selectSelections, setData } from './appSlice';
import CountyTooltip from './CountyTooltip';
import MapControls from './MapControls';
import DataDescription from './DataDescription';
import Overlays from './Overlays';
import DataSourceDescription from './DataSourceDescription';
import { autoType, csv, DSVParsedArray } from 'd3';
import { useThunkDispatch } from './Home';

export const ZOOM_TRANSITION = { transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" };

const mergeFIPSCodes = (row: CsvRow): [CountyId, number | null] => {
    let stateId = row.state_id.toString();
    let countyId = row.county_id.toString();
    const value = row.value;

    stateId = "0".repeat(2 - stateId.length) + stateId;
    countyId = "0".repeat(3 - countyId.length) + countyId;
    return [stateId + countyId, value];
}

type CsvRow = {
    state_id: number;
    county_id: number;
    value: number;
}

const MapWrapper = () => {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const mapVisualizations = useSelector(selectMapVisualizations);
    const map = useSelector((state: RootState) => state.app.map);
    const detailedView = useSelector((state: RootState) => state.app.detailedView);
    const processedData = useSelector(selectProcessedData);
    const isNormalized = useSelector(selectIsNormalized);
    const selections = useSelector(selectSelections);
    const dispatch = useThunkDispatch();

    useEffect(() => {
        if (Object.entries(mapVisualizations).length === 0) {
            return
        }
        const loadingCsvs = selections.map(selection => {
            const dataset = mapVisualizations[selection.mapVisualization].dataset;
            const startDate = selection.dateRange.start.toISODate();
            const endDate = selection.dateRange.end.toISODate();
            const source = selection.dataSource;
            return csv<CsvRow>("api/data/" + dataset +
                "?source=" + source +
                "&start_date=" + startDate +
                "&end_date=" + endDate, autoType)
                .then(csvRow => [dataset, csvRow] as [number, DSVParsedArray<CsvRow>]);
        });
        Promise.all(loadingCsvs).then(loadedCsvs => {
            const allData: DataByDataset = {};
            for (const [dataset, csv] of loadedCsvs) {
                const dataByCountyId = csv.reduce((accumulator, row) => {
                    const [fips, value] = mergeFIPSCodes(row);
                    accumulator[fips] = value;
                    return accumulator;
                }, {} as Data);
                allData[dataset] = dataByCountyId;
            }
            dispatch(setData(allData));
        })
    }, [dispatch, mapVisualizations, selections]);

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
                        selectedMapVisualizations={selectedMapVisualizations}
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
