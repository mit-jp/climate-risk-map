import { Delete } from '@mui/icons-material'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import ColumnEditor from './ColumnEditor'
import { ExistingDataset, NewDataset, UploadDataset } from './UploadData'
import css from './Uploader.module.css'
import { deleteDataset, onDatasetChange } from './uploaderSlice'

const INPUT_MARGIN = { margin: '0.5em 0' }

function DatasetSelector({ dataset }: { dataset: ExistingDataset }) {
    return <p>{dataset.id}</p>
}

function DatasetProps({ dataset }: { dataset: NewDataset }) {
    const dispatch = useDispatch()
    return (
        <>
            <TextField
                required
                sx={INPUT_MARGIN}
                label="Name"
                value={dataset.name}
                onChange={(e) =>
                    dispatch(onDatasetChange({ name: e.target.value, uuid: dataset.uuid }))
                }
            />
            <TextField
                sx={INPUT_MARGIN}
                label="Units"
                value={dataset.units}
                onChange={(e) =>
                    dispatch(onDatasetChange({ units: e.target.value, uuid: dataset.uuid }))
                }
            />
            <TextField
                sx={INPUT_MARGIN}
                multiline
                fullWidth
                label="Description"
                value={dataset.description}
                onChange={(e) =>
                    dispatch(onDatasetChange({ description: e.target.value, uuid: dataset.uuid }))
                }
            />
        </>
    )
}

export default function DatasetEditor({
    dataset,
    possibleColumns,
    deletable,
}: {
    dataset: UploadDataset
    possibleColumns: string[]
    deletable: boolean
}) {
    const dispatch = useDispatch()
    const [shouldReplaceData, setReplaceData] = useState(false)

    return (
        <Card className={css.datasetEditor}>
            <CardContent>
                <h3>Column</h3>

                <ColumnEditor
                    possibleColumns={possibleColumns}
                    column={dataset.column}
                    datasetUuid={dataset.uuid}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={shouldReplaceData}
                            onChange={(_, shouldReplaceData) =>
                                dispatch(setReplaceData({ uuid: dataset.uuid, shouldReplaceData }))
                            }
                        />
                    }
                    label="Replace previous data"
                />
                {'name' in dataset ? (
                    <DatasetProps dataset={dataset} />
                ) : (
                    <DatasetSelector dataset={dataset} />
                )}
            </CardContent>
            {deletable && (
                <CardActions>
                    <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => dispatch(deleteDataset(dataset.uuid))}
                        className={css.deleteButton}
                    >
                        Delete
                    </Button>
                </CardActions>
            )}
        </Card>
    )
}
