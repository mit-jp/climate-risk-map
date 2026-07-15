import { useDispatch } from 'react-redux'
import { Button, Delete, TextField } from '../ui'
import ColumnEditor from './ColumnEditor'
import css from './Uploader.module.css'
import { Dataset, deleteDataset, onDatasetChange } from './uploaderSlice'

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
                label="Name"
                value={dataset.name}
                onChange={(e) =>
                    dispatch(onDatasetChange({ id: dataset.id, name: e.target.value }))
                }
            />
            <TextField
                label="Units"
                value={dataset.units}
                onChange={(e) =>
                    dispatch(onDatasetChange({ id: dataset.id, units: e.target.value }))
                }
            />
            <TextField
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
