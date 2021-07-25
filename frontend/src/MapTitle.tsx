import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";
import { MapVisualization } from "./FullMap";

const useTooltipStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
        fontSize: theme.typography.fontSize,
    },
}));

const getTitle = (selectedMaps: MapVisualization[]) => {
    if (selectedMaps.length > 1) {
        return "Combined data";
    } else if (selectedMaps.length === 0) {
        return ""
    } else {
        return selectedMaps[0].name;
    }
}

type Props = {
    selectedMapVisualizations: MapVisualization[],
    isNormalized: boolean,
};

const MapTitle = ({ selectedMapVisualizations, isNormalized }: Props) => {
    const tooltipClasses = useTooltipStyles();
    return (
        <h3 id="map-title">
            {getTitle(selectedMapVisualizations)}
            {
                isNormalized &&
                <Tooltip
                    classes={tooltipClasses}
                    arrow
                    placement="top"
                    title="The normalized value is the percentile
                of the raw data. If you select multiple data,
                we take the mean of the ranked values.">
                    <IconButton aria-label="info">
                        <Info />
                    </IconButton>
                </Tooltip>
            }
        </h3>
    );
}

export default MapTitle;