import { json } from "d3";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TopoJson } from "../TopoJson";
import { getDataQueryParams, MapVisualization } from "../MapVisualization";
import { RootState, store } from "../store";
import "./Editor.css";
import { clickMapVisualization, clickTab, selectSelectedTabAndMapVisualization, setMap } from "./editorSlice";
import { Tab, useGetMapVisualizationsQuery, useGetTabsQuery } from "../MapApi";
import EditorMap from "./EditorMap";

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

const Editor = () => {
    const dispatch = useThunkDispatch();
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery(undefined);
    const { data: tabs } = useGetTabsQuery(undefined);
    const { selectedTabId, selectedMapVisualizationId } = useSelector(selectSelectedTabAndMapVisualization);
    const selectedMapVisualization = allMapVisualizations && selectedTabId !== undefined && selectedMapVisualizationId !== undefined
        ? allMapVisualizations[selectedTabId][selectedMapVisualizationId]
        : undefined;
    const mapVisualizationsForTab = allMapVisualizations && selectedTabId !== undefined
        ? Object.values(allMapVisualizations[selectedTabId]).sort((a, b) => a.order - b.order)
        : undefined;
    const map = useSelector((state: RootState) => state.editor.map);
    const queryParams = selectedMapVisualization ? getDataQueryParams(selectedMapVisualization) : undefined;

    useEffect(() => {
        json<TopoJson>(process.env.PUBLIC_URL + "/usa.json").then(topoJson => {
            if (topoJson) {
                dispatch(setMap(topoJson));
            }
        });
    }, [dispatch]);

    return (
        <div id="editor-wrapper">
            {tabs
                ? <Navigation tabs={tabs} selectedTabId={selectedTabId} />
                : <EmptyNavigation />}
            <div id="editor">
                {mapVisualizationsForTab
                    ? <MapVisualizationList mapVisualizations={mapVisualizationsForTab} selectedMapVisualizationId={selectedMapVisualizationId} />
                    : <EmptyMapVisualizationList />
                }
                {map && selectedMapVisualization && queryParams && <EditorMap
                    map={map}
                    selection={selectedMapVisualization}
                    detailedView={true}
                    isNormalized={selectedMapVisualization.should_normalize}
                    queryParams={queryParams}
                />}
                <MapOptions />
            </div>
        </div>
    );
}
const EmptyNavigation = () => <nav></nav>
const Navigation = ({ tabs, selectedTabId }: { tabs: Tab[], selectedTabId?: number }) => {
    const dispatch = useThunkDispatch();
    return (
        <nav>
            <ul>
                {tabs.map(tab =>
                    <li className={selectedTabId === tab.id ? "selected" : undefined}
                        onClick={_ => dispatch(clickTab(tab))}
                        key={tab.id}>
                        {tab.name}
                    </li>
                )}
            </ul>
        </nav>
    );
}
const EmptyMapVisualizationList = () => <ol></ol>;
const MapVisualizationList = ({ mapVisualizations, selectedMapVisualizationId }:
    {
        mapVisualizations: MapVisualization[],
        selectedMapVisualizationId?: number
    }) => {
    const dispatch = useThunkDispatch();
    return (
        <ol>
            {mapVisualizations.map(mapVisualization =>
                <li
                    className={selectedMapVisualizationId === mapVisualization.id ? "selected" : undefined}
                    key={mapVisualization.id}
                    onClick={() => dispatch(clickMapVisualization(mapVisualization))}>
                    {mapVisualization.name}
                </li>
            )}
        </ol>
    );
}

const MapOptions = () => <div id="map-options">map options</div>;

export default Editor;