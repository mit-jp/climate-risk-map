import { useDispatch } from 'react-redux'
import { Button, Delete, TextField } from '../ui'
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
        <div className={`ui-card ${css.datasetEditor}`}>
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
                style={INPUT_MARGIN}
                label="Name"
                value={dataset.name}
                onChange={(e) =>
                    dispatch(onDatasetChange({ id: dataset.id, name: e.target.value }))
                }
            />
            <TextField
                style={INPUT_MARGIN}
                label="Units"
                value={dataset.units}
                onChange={(e) =>
                    dispatch(onDatasetChange({ id: dataset.id, units: e.target.value }))
                }
            />
            <TextField
                style={INPUT_MARGIN}
                multiline
                fullWidth
                label="Description"
                value={dataset.description}
                onChange={(e) =>
                    dispatch(onDatasetChange({ id: dataset.id, description: e.target.value }))
                }
            />
            {deletable && (
                <Button
                    variant="outlined"
                    onClick={() => dispatch(deleteDataset(dataset.id))}
                    className={css.deleteButton}
                >
                    <Delete size={20} />
                    Delete
                </Button>
            )}
        </div>
    )
}
