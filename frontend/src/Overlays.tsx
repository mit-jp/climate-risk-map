import * as scales from 'd3-scale-chromatic';
import React from "react";
import { useSelector } from "react-redux";
import { feature } from "topojson-client";
import { TopoJson } from "./Home";
import { RootState } from "./store";
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import { geoPath, scaleQuantize, scaleSequential } from "d3";
import { OverlayName, selectMapTransform } from "./appSlice";
import { ZOOM_TRANSITION } from "./MapWrapper";

const path = geoPath();
const toxicSitesPath = geoPath().pointRadius(1);
const toxicSitesColor = scaleQuantize([1, 10], scales.schemeYlOrRd[9]);
// const toxicSitesColor = scaleSequential<string>([0, 10], scales.interpolateYlOrRd);

const Overlays = () => {
    const overlays = useSelector((state: RootState) => state.app.overlays);
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue);
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType);
    const transform = useSelector(selectMapTransform);

    const generatePaths = (name: OverlayName, topoJson: TopoJson) => {
        let features = feature(
            topoJson,
            topoJson.objects.overlay as GeometryCollection<GeoJsonProperties>
        ).features;
        let thePath = path;
        let strokeWidth: ((d: Feature<Geometry, GeoJsonProperties>) => number);
        let color: ((d: Feature<Geometry, GeoJsonProperties>) => string);
        let fill: ((d: Feature<Geometry, GeoJsonProperties>) => string) = () => "none";
        switch (name) {
            case "Highways":
                strokeWidth = d => 1 / d.properties!.scalerank * 5;
                color = () => "grey";
                break;
            case "Marine highways":
                strokeWidth = d => Math.sqrt(d.properties![waterwayValue] / 5_000_000);
                color = () => "#0099ff";
                break;
            case "Transmission lines":
                strokeWidth = d => d.properties!.V >= 345 ? 2 : 1;
                color = d => d.properties!.V < 345 ? "#1b9e77" : "#d95f02";
                switch (transmissionLineType) {
                    case "Level 2 (230kV-344kV)":
                        features = features.filter(d => d.properties!.V < 345);
                        break;
                    case "Level 3 (>= 345kV)":
                        features = features.filter(d => d.properties!.V >= 345);
                        break;
                }
                break;
            case "Major railroads":
                strokeWidth = () => 1;
                color = () => "grey";
                break;
            case "Critical water habitats":
                strokeWidth = () => 1;
                color = () => "#0099ff";
                break;
            case "Toxic sites":
                strokeWidth = () => 0;
                thePath = toxicSitesPath;
                color = () => "none";
                features = features.sort((a, b) => a.properties!.avg_risk_s - b.properties!.avg_risk_s);
                fill = d => toxicSitesColor(d.properties!.avg_risk_s);
                break;
        }
        return features.map((feature, index) =>
            <path
                key={feature.id ?? index}
                stroke={color(feature)}
                strokeWidth={strokeWidth(feature)}
                fill={fill(feature)}
                d={thePath(feature) ?? undefined}
                style={{ transition: "stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
        );
    }

    return (
        <React.Fragment>
            {Object.entries(overlays)
                .filter(([_, overlay]) => overlay.shouldShow && overlay.topoJson)
                .map(([name, overlay]) => [name, overlay.topoJson] as [OverlayName, TopoJson])
                .map(([name, topoJson]) =>
                    <g id={name.replaceAll(" ", "-")} key={name} transform={transform} style={ZOOM_TRANSITION}>
                        {generatePaths(name, topoJson)}
                    </g>
                )}
        </React.Fragment>
    );
};

export default Overlays;
