import { Delete } from '@mui/icons-material'
import { Button, MenuItem, Select } from '@mui/material'
import { useDispatch } from 'react-redux'
import css from './Uploader.module.css'
import { Column, removeColumn, selectColumn } from './uploaderSlice'

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
