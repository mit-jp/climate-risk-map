import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUpdateDatasetMutation } from '../MapApi'
import { MapSpec } from '../MapVisualization'

function EditorMapDescription({ selectedMap }: { selectedMap: MapSpec }) {
    const [updateDataset, { isLoading }] = useUpdateDatasetMutation()
    const [description, setDescription] = useState(selectedMap.description)

    useEffect(() => {
        setDescription(selectedMap.description)
    }, [selectedMap])

    const noDiff = () => description === selectedMap.description

    return (
        <form
            onSubmit={(e) => {
                updateDataset({ id: selectedMap.dataset, description })
                e.preventDefault()
            }}
        >
            <TextField
                label="Description"
                value={description}
                multiline
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
            />
            <LoadingButton
                type="submit"
                loading={isLoading}
                variant="contained"
                disabled={noDiff()}
            >
                save
            </LoadingButton>
        </form>
    )
}
export default EditorMapDescription
