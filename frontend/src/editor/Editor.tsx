import { json } from "d3";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TopoJson } from "../TopoJson";
import { RootState, store } from "../store";
import "./Editor.css";
import { clickMapVisualization, clickTab, selectSelectedTabAndMapVisualization, setMap } from "./editorSlice";
import { Tab, useGetMapVisualizationQuery, useGetMapVisualizationsQuery, useGetTabsQuery } from "../MapApi";
import EditorMap from "./EditorMap";
import MapVisualizationList, { EmptyMapVisualizationList } from "./MapVisualizationList";
import MapOptions, { EmptyMapOptions } from "./MapOptions";
import { skipToken } from "@reduxjs/toolkit/dist/query";

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

const Editor = () => {
    const dispatch = useThunkDispatch();
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery(undefined);
    const { data: tabs } = useGetTabsQuery(undefined);
    const { selectedTabId, selectedMapVisualizationId } = useSelector(selectSelectedTabAndMapVisualization);
    const { data: selectedMapVisualization } = useGetMapVisualizationQuery(selectedMapVisualizationId ?? skipToken);
    const mapVisualizationsForTab = allMapVisualizations && selectedTabId !== undefined
        ? Object.values(allMapVisualizations[selectedTabId]).sort((a, b) => a.order - b.order)
        : undefined;
    const map = useSelector((state: RootState) => state.editor.map);

    useEffect(() => {
        json<TopoJson>("usa.json").then(topoJson => {
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
                    ? <MapVisualizationList
                        mapVisualizations={mapVisualizationsForTab}
                        selectedId={selectedMapVisualizationId}
                        onClick={map => dispatch(clickMapVisualization(map))} />
                    : <EmptyMapVisualizationList />
                }
                {map && <EditorMap
                    map={map}
                    selection={selectedMapVisualization}
                    detailedView={true}
                />}
                {selectedMapVisualization
                    ? <MapOptions mapVisualization={selectedMapVisualization} />
                    : <EmptyMapOptions />
                }
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

export default Editor;