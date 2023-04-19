import { MenuItem, Select } from '@mui/material'
import { useDispatch } from 'react-redux'
import css from './Uploader.module.css'
import { selectColumn } from './uploaderSlice'

export default function ColumnEditor({
    column,
    possibleColumns,
    datasetUuid,
}: {
    column: string
    possibleColumns: string[]
    datasetUuid: string
}) {
    const dispatch = useDispatch()
    return (
        <div className={css.columnEditor}>
            <Select
                required
                className={css.columnSelect}
                value={column}
                onChange={(e) =>
                    dispatch(selectColumn({ uuid: datasetUuid, newName: e.target.value }))
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
