import { useDispatch } from 'react-redux'
import { TextField } from '../ui'
import { NewSource } from './UploadData'
import { setSourceDescription, setSourceLink, setSourceName } from './uploaderSlice'

export default function NewSourceInput({ source }: { source: NewSource }) {
    const dispatch = useDispatch()

    return (
        <>
            <TextField
                required
                onChange={(e) => dispatch(setSourceName(e.target.value))}
                value={source.name}
                label="Name"
            />
            <TextField
                type="url"
                required
                onChange={(e) => dispatch(setSourceLink(e.target.value))}
                value={source.link}
                label="Url"
            />
            <TextField
                required
                multiline
                fullWidth
                value={source.description}
                onChange={(e) => dispatch(setSourceDescription(e.target.value))}
                label="Description"
            />
        </>
    )
}
