import { useEffect, useState } from 'react'
import { useUpdateDatasetMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'
import { Button, TextField } from '../ui'

function EditorMapDescription({ selectedMap }: { selectedMap: MapVisualization }) {
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
            <Button type="submit" loading={isLoading} variant="contained" disabled={noDiff()}>
                save
            </Button>
        </form>
    )
}
export default EditorMapDescription
