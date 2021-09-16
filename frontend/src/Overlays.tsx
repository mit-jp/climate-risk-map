import React from "react";
import { useSelector } from "react-redux";
import { feature } from "topojson-client";
import { TopoJson } from "./Home";
import { RootState } from "./store";
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import { geoPath } from "d3";

const path = geoPath();

const Overlays = () => {
    const overlays = useSelector((state: RootState) => state.app.overlays);
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue);
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType);

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
                key={feature.id ?? index}
                stroke={color(feature)}
                strokeWidth={strokeWidth(feature)}
                fill="none"
                d={path(feature) ?? undefined}
                style={{ transition: "stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
        );
    }

    return (
        <React.Fragment>

        </React.Fragment>
    );
};

export default Overlays;