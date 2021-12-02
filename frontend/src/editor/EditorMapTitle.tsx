import { TextField } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useState } from "react";
import { useUpdateMapVisualizationMutation } from "../MapApi";
import { MapVisualization } from "../MapVisualization";

type Props = { mapVisualization: MapVisualization };

const EditorMapTitle = ({ mapVisualization }: Props) => {
    const [title, setTitle] = useState(mapVisualization.name);
    const [updateMap, { isLoading }] = useUpdateMapVisualizationMutation();

    return <form id="title-form">
        <TextField
            label="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isLoading}
            fullWidth
        />
        <LoadingButton onClick={() => updateMap({ ...mapVisualization, name: title })} variant="contained" loading={isLoading}>Save</LoadingButton>
        <LoadingButton onClick={() => updateMap({ ...mapVisualization, name: undefined })} loading={isLoading}>Reset</LoadingButton>
    </form>
}

export default EditorMapTitle;