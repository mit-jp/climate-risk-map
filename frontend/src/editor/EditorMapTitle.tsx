import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUpdateMapSpecMutation } from '../MapApi'
import { MapSpec } from '../MapVisualization'
import css from './Editor.module.css'

type Props = { mapVisualization: MapSpec }

function EditorMapTitle({ mapVisualization }: Props) {
    const [title, setTitle] = useState(mapVisualization.name ?? '')
    const [updateMap, { isLoading }] = useUpdateMapSpecMutation()
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
                inputProps={{ maxLength: 100 }}
            />
            <LoadingButton
                onClick={() => updateMap({ ...mapVisualization, name: title || undefined })} // set to undefined if empty string
                variant="contained"
                disabled={currentTitle === title}
                loading={isLoading}
            >
                Save
            </LoadingButton>
            <LoadingButton
                onClick={() => updateMap({ ...mapVisualization, name: undefined })}
                loading={isLoading}
                disabled={currentTitle === ''}
            >
                Clear
            </LoadingButton>
        </div>
    )
}

export default EditorMapTitle
