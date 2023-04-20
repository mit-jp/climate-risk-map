import { Delete } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import ColumnEditor from './ColumnEditor'
import css from './Uploader.module.css'
import { Dataset, deleteDataset, onDatasetChange } from './uploaderSlice'

const INPUT_MARGIN = { margin: '0.5em 0' }

export default function DatasetEditor({
    dataset,
    possibleColumns,
    deletable,
}: {
    dataset: Dataset
    possibleColumns: string[]
    deletable: boolean
}) {
    const dispatch = useDispatch()

    return (
        <Card className={css.datasetEditor}>
            <CardContent>
                <h3>Column</h3>
                <div>
                    <ColumnEditor
                        column={dataset.column}
                        possibleColumns={possibleColumns}
                        datasetId={dataset.id}
                    />
                </div>
                <TextField
                    required
                    sx={INPUT_MARGIN}
                    label="Name"
                    value={dataset.name}
                    onChange={(e) =>
                        dispatch(onDatasetChange({ id: dataset.id, name: e.target.value }))
                    }
                />
                <TextField
                    sx={INPUT_MARGIN}
                    label="Units"
                    value={dataset.units}
                    onChange={(e) =>
                        dispatch(onDatasetChange({ id: dataset.id, units: e.target.value }))
                    }
                />
                <TextField
                    sx={INPUT_MARGIN}
                    multiline
                    fullWidth
                    label="Description"
                    value={dataset.description}
                    onChange={(e) =>
                        dispatch(onDatasetChange({ id: dataset.id, description: e.target.value }))
                    }
                />
            </CardContent>
            {deletable && (
                <CardActions>
                    <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => dispatch(deleteDataset(dataset.id))}
                        className={css.deleteButton}
                    >
                        Delete
                    </Button>
                </CardActions>
            )}
        </Card>
    )
}
