import { TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useUpdateMapVisualizationMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'

type Props = { mapVisualization: MapVisualization }

function EditorMapTitle({ mapVisualization }: Props) {
    const [title, setTitle] = useState(mapVisualization.name)
    const [updateMap, { isLoading }] = useUpdateMapVisualizationMutation()

    return (
        <div id="title-field">
            <TextField
                label="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                fullWidth
            />
            <LoadingButton
                onClick={() => updateMap({ ...mapVisualization, name: title })}
                variant="contained"
                loading={isLoading}
            >
                Save
            </LoadingButton>
            <LoadingButton
                onClick={() => updateMap({ ...mapVisualization, name: undefined })}
                loading={isLoading}
            >
                Reset
            </LoadingButton>
        </div>
    )
}

export default EditorMapTitle
