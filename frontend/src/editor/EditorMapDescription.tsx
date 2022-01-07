import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { MapVisualization } from '../MapVisualization'

type DatasetDiff = { id: number; description: string }
const updateDataset = (diff: DatasetDiff) => null

function EditorMapDescription({ selectedMap }: { selectedMap: MapVisualization }) {
    const [description, setDescription] = useState(selectedMap.description)
    const isLoading = false

    return (
        <form>
            <TextField
                label="Description"
                value={selectedMap.description}
                multiline
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
            />
            <LoadingButton
                onClick={() => updateDataset({ id: selectedMap.dataset, description })}
                loading={isLoading}
                variant="contained"
            >
                save
            </LoadingButton>
        </form>
    )
}
export default EditorMapDescription
