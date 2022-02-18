import { TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { INPUT_MARGIN } from './MetadataForm'
import { NewSource } from './UploadData'
import { setSourceDescription, setSourceLink, setSourceName } from './uploaderSlice'

export default function NewSourceInput({ source }: { source: NewSource }) {
    const dispatch = useDispatch()

    return (
        <>
            <TextField
                required
                sx={INPUT_MARGIN}
                onChange={(e) => dispatch(setSourceName(e.target.value))}
                value={source.name}
                label="Name"
            />
            <TextField
                type="url"
                required
                sx={INPUT_MARGIN}
                onChange={(e) => dispatch(setSourceLink(e.target.value))}
                value={source.link}
                label="Url"
            />
            <TextField
                required
                multiline
                fullWidth
                sx={INPUT_MARGIN}
                value={source.description}
                onChange={(e) => dispatch(setSourceDescription(e.target.value))}
                label="Description"
            />
        </>
    )
}
