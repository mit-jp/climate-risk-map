import { useSelector } from 'react-redux';
import { RootState } from './store';
import EmptyMap from './EmptyMap';
import FullMap from './FullMap';
import MapTitle, { EmptyMapTitle } from './MapTitle';
import { selectDataQueryParams, selectIsNormalized, selectSelectedMapVisualizations } from './appSlice';
import CountyTooltip from './CountyTooltip';
import MapControls from './MapControls';
import DataDescription from './DataDescription';
import Overlays from './Overlays';
import DataSourceDescription from './DataSourceDescription';
import { useGetDataQuery } from './MapApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import DataProcessor from './DataProcessor';

export const ZOOM_TRANSITION = { transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" };

const MapWrapper = () => {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const map = useSelector((state: RootState) => state.app.map);
    const detailedView = useSelector((state: RootState) => state.app.detailedView);
    const isNormalized = useSelector(selectIsNormalized);
    const state = useSelector((state: RootState) => state.app.state);
    const dataWeights = useSelector((state: RootState) => state.app.dataWeights);
    const queryParams = useSelector(selectDataQueryParams);
    const { data } = useGetDataQuery(queryParams ?? skipToken);

    let processedData = data ?
        DataProcessor(data, selectedMapVisualizations, dataWeights, state, isNormalized) :
        undefined;

    if (map === undefined) {
        return <p>Loading</p>;
    }
    return (
        <div id="map">
            {
                selectedMapVisualizations.length > 0
                    ? <MapTitle
                        selectedMapVisualizations={selectedMapVisualizations}
                        isNormalized={isNormalized} />
                    : <EmptyMapTitle />
            }
            <svg
                id="map-svg"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0, 0, 1175, 610"
            >
                {processedData
                    ? <FullMap
                        map={map}
                        selectedMapVisualizations={selectedMapVisualizations}
                        data={processedData}
                        detailedView={detailedView}
                        isNormalized={isNormalized}
                        showTooltip={true}
                    />
                    : <EmptyMap map={map} />}
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
