import { useEffect, useState } from 'react'
import { useUpdateMapVisualizationMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'
import { Button, TextField } from '../ui'
import css from './Editor.module.css'

type Props = { mapVisualization: MapVisualization }

function EditorMapTitle({ mapVisualization }: Props) {
    const [title, setTitle] = useState(mapVisualization.name ?? '')
    const [updateMap, { isLoading }] = useUpdateMapVisualizationMutation()
    const currentTitle = mapVisualization.name ?? ''
    useEffect(() => {
        setTitle(currentTitle)
    }, [currentTitle])

    return (
        <div id={css.titleField}>
            <TextField
                label="Custom Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                fullWidth
                maxLength={100}
            />
            <Button
                onClick={() => updateMap({ ...mapVisualization, name: title || undefined })} // set to undefined if empty string
                variant="contained"
                disabled={currentTitle === title}
                loading={isLoading}
            >
                Save
            </Button>
            <Button
                onClick={() => updateMap({ ...mapVisualization, name: undefined })}
                loading={isLoading}
                disabled={currentTitle === ''}
            >
                Clear
            </Button>
        </div>
    )
}

export default EditorMapTitle
