import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTab from "../DataTab";
import { fetchMapVisualizations, MapVisualization } from "../MapVisualization";
import { RootState, store } from "../store";
import "./Editor.css";
import { clickTab, selectMapVisualizationsForTab, selectTabs, setMapVisualizations } from "./editorSlice";
export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

const Editor = () => {
    const dispatch = useThunkDispatch();
    const mapVisualizations = useSelector(selectMapVisualizationsForTab);
    const tabs = useSelector(selectTabs);

    useEffect(() => {
        fetchMapVisualizations().then(mapVisualizations => {
            if (mapVisualizations) {
                dispatch(setMapVisualizations(mapVisualizations));
            }
        });
    }, [dispatch]);

    return (
        <div id="editor-wrapper">
            <Navigation tabs={tabs} />
            <div id="editor">
                <MapVisualizationList mapVisualizations={mapVisualizations} />
                <MapPreview />
                <MapOptions />
            </div>
        </div>
    );
}
const Navigation = ({ tabs }: { tabs: DataTab[] }) => {
    const dispatch = useThunkDispatch();
    const selectedTab = useSelector((state: RootState) => state.editor.selectedTab);

    return (
        <nav>
            <ul>
                {tabs.map(tab =>
                    <li className={selectedTab === tab ? "selected" : undefined}
                        onClick={event => dispatch(clickTab(event.currentTarget.textContent as DataTab))}
                        key={tab}>
                        {tab}
                    </li>
                )}
            </ul>
        </nav>
    );
}
const MapVisualizationList = ({ mapVisualizations }: { mapVisualizations: MapVisualization[] }) =>
    <ol>
        {mapVisualizations.map(mapVisualization =>
            <li key={mapVisualization.id}>{mapVisualization.name}</li>
        )}
    </ol>

const MapPreview = () => <div id="map-preview">map preview</div>;
const MapOptions = () => <div id="map-options">map options</div>;

export default Editor;