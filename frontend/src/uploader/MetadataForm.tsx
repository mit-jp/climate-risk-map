import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import DatasetEditor from './DatasetEditor'
import {
    createDataset,
    Dataset,
    setCountyColumn,
    setExistingSource,
    setStateColumn,
    toggleExistingSource,
} from './uploaderSlice'
import { FormData } from './UploadData'
import { DataSource } from '../MapVisualization'
import NewSourceInput from './NewSourceInput'

export const INPUT_MARGIN = { margin: '0.5em 0' }

function getPossibleColumns(
    columns: string[],
    datasets: Dataset[],
    stateColumn: string | undefined,
    countyColumn: string | undefined,
    datasetId: string
): string[] {
    const otherDatasetColumns = datasets
        .filter((dataset) => dataset.id !== datasetId)
        .flatMap((dataset) => dataset.columns)
        .map((column) => column.name)
    return (
        columns.filter(
            (column) =>
                column !== stateColumn &&
                column !== countyColumn &&
                !otherDatasetColumns.includes(column)
        ) ?? []
    )
}

export default function MetadataForm({
    stateColumn,
    countyColumn,
    source,
    datasets,
    columns,
    freeColumns,
    dataSources,
}: FormData & { dataSources: DataSource[] }) {
    const dispatch = useDispatch()

    return (
        <>
            <h2>Select state id column</h2>
            <Select
                required
                label="State id column"
                onChange={(e) => dispatch(setStateColumn(e.target.value))}
                value={stateColumn}
            >
                {columns.map((column) => (
                    <MenuItem value={column} key={column}>
                        {column}
                    </MenuItem>
                ))}
            </Select>

            <h2>Select county id column</h2>
            <Select
                required
                label="County id column"
                onChange={(e) => dispatch(setCountyColumn(e.target.value))}
                value={countyColumn}
            >
                {columns.map((column) => (
                    <MenuItem value={column} key={column}>
                        {column}
                    </MenuItem>
                ))}
            </Select>

            <h2>Source</h2>
            <FormControlLabel
                control={
                    <Checkbox
                        name="Use Existing Source"
                        value={'id' in source}
                        onChange={(_, value) =>
                            dispatch(toggleExistingSource(value ? dataSources[0] : undefined))
                        }
                    />
                }
                label="Use Existing Source"
            />

            {'id' in source && (
                <Autocomplete
                    sx={INPUT_MARGIN}
                    value={source}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, value) => {
                        if (value) dispatch(setExistingSource(value))
                    }}
                    options={dataSources}
                    renderInput={(params) => <TextField {...params} label="Name" />}
                />
            )}
            {!('id' in source) && <NewSourceInput source={source} />}
            <h2>Data</h2>
            {datasets.map((dataset) => (
                <DatasetEditor
                    dataset={dataset}
                    key={dataset.id}
                    possibleColumns={getPossibleColumns(
                        columns,
                        datasets,
                        stateColumn,
                        countyColumn,
                        dataset.id
                    )}
                    deletable={datasets.length > 1}
                    freeColumns={freeColumns}
                />
            ))}

            <Button
                onClick={() => dispatch(createDataset())}
                disabled={freeColumns.length === 0}
                variant="outlined"
            >
                Add dataset
            </Button>
        </>
    )
}
