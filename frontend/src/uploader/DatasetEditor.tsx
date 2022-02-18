import { useDispatch } from 'react-redux'
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Dataset, onDatasetChange, addColumn, deleteDataset } from './uploaderSlice'
import css from './Uploader.module.css'
import ColumnEditor from './ColumnEditor'

const INPUT_MARGIN = { margin: '0.5em 0' }

export default function DatasetEditor({
    dataset,
    possibleColumns,
    freeColumns,
    deletable,
}: {
    dataset: Dataset
    possibleColumns: string[]
    freeColumns: string[]
    deletable: boolean
}) {
    const dispatch = useDispatch()

    return (
        <Card className={css.datasetEditor}>
            <CardContent>
                <h3>Column{dataset.columns.length > 1 ? 's' : ''}</h3>
                <div>
                    {dataset.columns.map((column) => (
                        <ColumnEditor
                            column={column}
                            possibleColumns={possibleColumns}
                            key={column.name}
                            datasetId={dataset.id}
                            canDelete={dataset.columns.length > 1}
                            canChangeName={dataset.columns.length === 1}
                        />
                    ))}
                    <Button
                        onClick={() => dispatch(addColumn(dataset.id))}
                        disabled={freeColumns.length === 0}
                    >
                        Add column
                    </Button>
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
                    required
                    sx={INPUT_MARGIN}
                    label="Short name"
                    value={dataset.shortName}
                    onChange={(e) =>
                        dispatch(onDatasetChange({ id: dataset.id, shortName: e.target.value }))
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
