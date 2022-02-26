import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { MapVisualization } from '../MapVisualization'

function EditorMapDescription({ selectedMap }: { selectedMap: MapVisualization }) {
    const [, setDescription] = useState(selectedMap.description)
    const isLoading = false

    return (
        <form>
            <TextField
                label="Description"
                value={selectedMap.description}
                multiline
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
                disabled
            />
            <LoadingButton loading={isLoading} variant="contained" disabled>
                save
            </LoadingButton>
        </form>
    )
}
export default EditorMapDescription
