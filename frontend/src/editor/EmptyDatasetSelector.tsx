import { Autocomplete, TextField } from '@mui/material'

export default function EmptyDatasetSelector() {
    return (
        <Autocomplete
            disabled
            options={[]}
            renderInput={(params) => <TextField {...params} label="Dataset" />}
        />
    )
}
