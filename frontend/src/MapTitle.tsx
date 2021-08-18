import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";
import { DataDefinition, DataIdParams, Normalization } from "./DataDefinitions";
import { getDataDefinitions } from "./FullMap";

const useTooltipStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
        fontSize: theme.typography.fontSize,
    },
}));

const isNormalized = (selections: DataIdParams[]) => {
    return selections[0].normalization === Normalization.Percentile;
}

const getTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    if (selectedDataDefinitions.length > 1) {
        return "Combined data";
    } else {
        return selectedDataDefinitions[0].name(selections[0].normalization);
    }
}

const MapTitle = ({ selections }: { selections: DataIdParams[] }) => {
    const tooltipClasses = useTooltipStyles();
    return (
        <h3 id="map-title">
            {getTitle(getDataDefinitions(selections), selections)}
            {
                isNormalized(selections) &&
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