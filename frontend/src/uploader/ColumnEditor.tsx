import { MenuItem, Select } from '@mui/material'
import { useDispatch } from 'react-redux'
import css from './Uploader.module.css'
import { selectColumn } from './uploaderSlice'

export default function ColumnEditor({
    column,
    possibleColumns,
    datasetId,
}: {
    column: string
    possibleColumns: string[]
    datasetId: string
}) {
    const dispatch = useDispatch()
    return (
        <div className={css.columnEditor}>
            <Select
                required
                className={css.columnSelect}
                value={column}
                onChange={(e) =>
                    dispatch(
                        selectColumn({
                            datasetId,
                            column: e.target.value,
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
        </div>
    )
}
