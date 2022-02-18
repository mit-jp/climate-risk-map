import { useDispatch } from 'react-redux'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Column, removeColumn, selectColumn, setYear } from './uploaderSlice'
import css from './Uploader.module.css'

export default function ColumnEditor({
    column,
    possibleColumns,
    datasetId,
    canDelete,
    canChangeName,
}: {
    column: Column
    possibleColumns: string[]
    datasetId: string
    canDelete: boolean
    canChangeName: boolean
}) {
    const dispatch = useDispatch()
    return (
        <div className={css.columnEditor}>
            <Select
                required
                className={css.columnSelect}
                value={column.name}
                onChange={(e) =>
                    dispatch(
                        selectColumn({
                            datasetId,
                            oldName: column.name,
                            newName: e.target.value,
                            canChangeName,
                        })
                    )
                }
            >
                {possibleColumns.map((columnChoice) => {
                    return (
                        <MenuItem value={columnChoice} key={columnChoice}>
                            {columnChoice}
                        </MenuItem>
                    )
                })}
            </Select>

            <TextField
                required
                label="Year"
                type="number"
                inputProps={{
                    min: 0,
                    max: 3000,
                    step: 1,
                }}
                value={column.dateRange.start.year}
                onChange={(e) =>
                    dispatch(
                        setYear({
                            datasetId,
                            columnName: column.name,
                            year: Number(e.target.value),
                        })
                    )
                }
            />
            {canDelete && (
                <Button
                    onClick={() => dispatch(removeColumn({ datasetId, column: column.name }))}
                    startIcon={<Delete />}
                >
                    remove
                </Button>
            )}
        </div>
    )
}
