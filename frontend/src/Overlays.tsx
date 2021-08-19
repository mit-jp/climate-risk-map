import React from "react";
import { useSelector } from "react-redux";
import { feature } from "topojson-client";
import { TopoJson } from "./Home";
import { RootState } from "./store";
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import { geoPath } from "d3";
import { selectMapTransform } from "./appSlice";
import { ZOOM_TRANSITION } from "./MapWrapper";

const path = geoPath();

const Overlays = () => {
    const overlays = useSelector((state: RootState) => state.app.overlays);
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue);
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType);
    const transform = useSelector(selectMapTransform);

    const generatePaths = (name: string, topoJson: TopoJson) => {
        let features = feature(
            topoJson,
            topoJson.objects.overlay as GeometryCollection<GeoJsonProperties>
        ).features;
        let strokeWidth: ((d: Feature<Geometry, GeoJsonProperties>) => number);
        let color: ((d: Feature<Geometry, GeoJsonProperties>) => string);
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
            case "Critical habitats":
                strokeWidth = () => 1;
                color = () => "#0099ff";
                break;
        }
        return features.map((feature, index) =>
            <path
                key={index}
                stroke={color(feature)}
                strokeWidth={strokeWidth(feature)}
                fill="none"
                d={path(feature) ?? undefined}
            />
        );
    }

    return (
        <React.Fragment>
            {Object.entries(overlays)
                .filter(([_, overlay]) => overlay.shouldShow && overlay.topoJson)
                .map(([name, overlay]) => [name, overlay.topoJson] as [string, TopoJson])
                .map(([name, topoJson]) =>
                    <g id={name.replaceAll(" ", "-")} key={name} transform={transform} style={ZOOM_TRANSITION}>
                        {generatePaths(name, topoJson)}
                    </g>
                )}
        </React.Fragment>
    );
};

export default Overlays;