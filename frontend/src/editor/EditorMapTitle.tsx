import { Button, TextField } from "@mui/material";
import { useUpdateMapVisualizationMutation } from "../MapApi";
import { MapVisualization } from "../MapVisualization";

type Props = { mapVisualization: MapVisualization, isNormalized: boolean };

const EditorMapTitle = ({ mapVisualization, isNormalized }: Props) => {
    const [updateMap] = useUpdateMapVisualizationMutation();

    return <>
        <TextField
            label="title"
            value={mapVisualization.name}
            onChange={e => updateMap({ ...mapVisualization, name: e.target.value })}
        />
        <Button onClick={() => updateMap({ ...mapVisualization, name: undefined })}>Reset Name</Button>
    </>
}

export default EditorMapTitle;