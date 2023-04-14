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
import { GeographyType } from '../MapApi'
import { DataSource } from '../MapVisualization'
import DatasetEditor from './DatasetEditor'
import NewSourceInput from './NewSourceInput'
import { FormData } from './UploadData'
import {
    Dataset,
    createDataset,
    setExistingSource,
    setGeographyType,
    setIdColumn,
    toggleExistingSource,
} from './uploaderSlice'

export const INPUT_MARGIN = { margin: '0.5em 0' }

function getPossibleColumns(
    columns: string[],
    datasets: Dataset[],
    idColumn: string | undefined,
    datasetId: string
): string[] {
    const otherDatasetColumns = datasets
        .filter((dataset) => dataset.id !== datasetId)
        .flatMap((dataset) => dataset.columns)
        .map((column) => column.name)
    return (
        columns.filter((column) => column !== idColumn && !otherDatasetColumns.includes(column)) ??
        []
    )
}

export default function MetadataForm({
    geographyType,
    idColumn,
    source,
    datasets,
    geographyTypes,
    columns,
    freeColumns,
    dataSources,
}: FormData & { dataSources: DataSource[]; geographyTypes: GeographyType[] }) {
    const dispatch = useDispatch()

    return (
        <>
            <h2>Select geographic id column</h2>
            <Select
                required
                label="Geography type"
                onChange={(e) => dispatch(setGeographyType(Number(e.target.value)))}
                value={geographyType}
            >
                {geographyTypes.map((type) => (
                    <MenuItem value={type.id} key={type.id}>
                        {type.name}
                    </MenuItem>
                ))}
            </Select>
            <Select
                required
                label="Geographic id column"
                onChange={(e) => dispatch(setIdColumn(e.target.value))}
                value={idColumn}
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
                    possibleColumns={getPossibleColumns(columns, datasets, idColumn, dataset.id)}
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
