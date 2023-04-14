import { createSelector, createSlice } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import Papa from 'papaparse'
import { convert as makeUrlFriendly } from 'url-slug'
import { v4 as uuid } from 'uuid'
import { DataSource } from '../MapVisualization'
import { RootState } from '../store'
import { FormData, NewSource } from './UploadData'

export interface Column {
    readonly name: string
    readonly dateRange: Interval
}

export interface Dataset {
    readonly id: string
    readonly name: string
    readonly units: string
    readonly description: string
    readonly shortName: string
    readonly columns: Column[]
}

export interface DatasetDiff {
    readonly id: string
    readonly name?: string
    readonly units?: string
    readonly description?: string
    readonly shortName?: string
}

interface UploaderState {
    readonly csv?: Papa.ParseResult<any>
    readonly geographyType: number
    readonly idColumn: string
    readonly datasets: Dataset[]
    readonly source: NewSource | DataSource
}

const emptySource: NewSource = { name: '', description: '', link: '' }

const initialState: UploaderState = {
    datasets: [],
    geographyType: 1,
    idColumn: '',
    source: emptySource,
}

const findColumn = (
    columns: string[] | undefined,
    preferredName: string,
    preferredIndex: number
): string | undefined => {
    if (!columns) {
        return undefined
    }
    if (columns.includes(preferredName)) {
        return preferredName
    }
    if (columns[preferredIndex]) {
        return columns[preferredIndex]
    }
    return undefined
}
const generateDataColumns = (datasets: Dataset[]) => datasets.flatMap((d) => d.columns)

const findFreeColumns = (idColumn: string, columns: string[], dataColumns: Column[]): string[] => {
    if (columns.length === 0) {
        return []
    }
    const usedColumns: (string | undefined)[] = [idColumn, ...dataColumns.map((c) => c.name)]
    const freeColumns = columns.filter((c) => !usedColumns.includes(c))
    return freeColumns
}

const generateNextColumn = (state: UploaderState): Column | undefined => {
    const { idColumn, datasets, csv } = state
    const dataColumns = generateDataColumns(datasets)
    const freeColumns = findFreeColumns(idColumn, csv?.meta?.fields ?? [], dataColumns)
    if (freeColumns.length === 0) {
        return undefined
    }
    return {
        name: freeColumns[0],
        dateRange: Interval.fromISO('2020-01-01/2020-12-31'),
    }
}

const generateNextDataset = (state: UploaderState): Dataset | undefined => {
    const column = generateNextColumn(state)
    if (!column) {
        return undefined
    }
    return {
        id: uuid(),
        name: column.name,
        units: '',
        description: '',
        shortName: makeUrlFriendly(column.name, { separator: '_' }),
        columns: [column],
    }
}

const generateMetadata = (
    datasets: Dataset[],
    geographyType: number,
    idColumn: string,
    source: NewSource | DataSource,
    columns: string[] | undefined
): FormData | undefined => {
    if (columns === undefined) {
        return undefined
    }
    const dataColumns = generateDataColumns(datasets)
    const freeColumns = findFreeColumns(idColumn, columns, dataColumns)
    return {
        datasets,
        geographyType,
        idColumn,
        source,
        columns,
        freeColumns,
    }
}

export const uploaderSlice = createSlice({
    name: 'uploader',
    initialState,
    reducers: {
        setCsv: (state, { payload }: { payload: Papa.ParseResult<any> }) => {
            state.csv = payload
            state.idColumn = findColumn(state.csv.meta.fields, 'id', 0) ?? ''
            const dataset = generateNextDataset(state)
            if (dataset) {
                state.datasets = [dataset]
            }
        },
        createDataset: (state) => {
            const dataset = generateNextDataset(state)
            if (dataset) {
                state.datasets.push(dataset)
            }
        },
        setGeographyType: (state, { payload }: { payload: number }) => {
            state.geographyType = payload
        },
        setIdColumn: (state, { payload }: { payload: string }) => {
            state.idColumn = payload
        },
        setSourceName: (state, { payload }: { payload: string }) => {
            state.source.name = payload
        },
        setSourceLink: (state, { payload }: { payload: string }) => {
            state.source.link = payload
        },
        setSourceDescription: (state, { payload }: { payload: string }) => {
            state.source.description = payload
        },
        setExistingSource: (state, { payload }: { payload: DataSource }) => {
            state.source = payload
        },
        onDatasetChange: (state, { payload }: { payload: DatasetDiff }) => {
            const dataset = state.datasets.find((d) => d.id === payload.id)
            if (dataset) {
                Object.assign(dataset, payload)
            }
        },
        addColumn: (state, { payload }: { payload: string }) => {
            const newColumn = generateNextColumn(state)
            if (!newColumn) {
                return
            }
            const dataset = state.datasets.find((d) => d.id === payload)

            if (dataset) {
                dataset.columns.push(newColumn)
            }
        },
        setYear: (
            state,
            {
                payload,
            }: {
                payload: {
                    datasetId: string
                    columnName: string
                    year: number
                }
            }
        ) => {
            const dataset = state.datasets.find((d) => d.id === payload.datasetId)
            if (dataset) {
                const column = dataset.columns.find((c) => c.name === payload.columnName)
                const range = Interval.fromDateTimes(
                    DateTime.utc(payload.year, 1, 1),
                    DateTime.utc(payload.year, 12, 31)
                )
                if (column && range.isValid) {
                    column.dateRange = range
                }
            }
        },
        selectColumn: (
            state,
            {
                payload,
            }: {
                payload: {
                    datasetId: string
                    oldName: string
                    newName: string
                    canChangeName: boolean
                }
            }
        ) => {
            const { datasetId, oldName, newName, canChangeName } = payload
            const dataset = state.datasets.find((d) => d.id === datasetId)
            if (dataset) {
                const columnIndex = dataset.columns.findIndex((c) => c.name === oldName)
                if (columnIndex !== -1) {
                    dataset.columns[columnIndex].name = newName
                    if (canChangeName) {
                        dataset.name = newName
                        dataset.shortName = makeUrlFriendly(newName, { separator: '_' })
                    }
                }
            }
        },
        deleteDataset: (state, { payload }: { payload: string }) => {
            const datasetIndex = state.datasets.findIndex((d) => d.id === payload)
            if (datasetIndex !== -1) {
                state.datasets.splice(datasetIndex, 1)
            }
        },
        removeColumn: (state, { payload }: { payload: { datasetId: string; column: string } }) => {
            const { datasetId, column } = payload
            const dataset = state.datasets.find((d) => d.id === datasetId)
            if (dataset) {
                const columnIndex = dataset.columns.findIndex((c) => c.name === column)
                if (columnIndex !== -1) {
                    dataset.columns.splice(columnIndex, 1)
                }
            }
        },
        toggleExistingSource: (state, { payload }: { payload: DataSource | undefined }) => {
            if (payload) state.source = payload
            else state.source = emptySource
        },
    },
})
export const {
    setCsv,
    createDataset,
    setGeographyType,
    setIdColumn,
    setSourceName,
    setSourceLink,
    setSourceDescription,
    setExistingSource,
    onDatasetChange,
    addColumn,
    setYear,
    selectColumn,
    deleteDataset,
    removeColumn,
    toggleExistingSource,
} = uploaderSlice.actions

export const selectCsv = (state: RootState) => state.uploader.csv

export const selectDataColumns = createSelector(
    (state: RootState) => state.uploader.datasets,
    generateDataColumns
)

export const selectMetadata = createSelector(
    (state: RootState) => state.uploader.datasets,
    (state: RootState) => state.uploader.geographyType,
    (state: RootState) => state.uploader.idColumn,
    (state: RootState) => state.uploader.source,
    (state: RootState) => state.uploader.csv?.meta?.fields,
    generateMetadata
)

export default uploaderSlice.reducer
