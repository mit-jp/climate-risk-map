import { createSelector, createSlice } from '@reduxjs/toolkit'
import Papa from 'papaparse'
import { v4 as uuid } from 'uuid'
import { DataSource } from '../MapVisualization'
import { RootState } from '../store'
import { FormData, NewSource, UploadDataset } from './UploadData'

export interface DatasetDiff {
    readonly uuid: string
    readonly name?: string
    readonly units?: string
    readonly description?: string
}

interface UploaderState {
    readonly csv?: Papa.ParseResult<any>
    readonly geographyType: number
    readonly idColumn: string
    readonly dateColumn: string
    readonly datasets: UploadDataset[]
    readonly source: NewSource | DataSource
}

const emptySource: NewSource = { name: '', description: '', link: '' }

const initialState: UploaderState = {
    datasets: [],
    geographyType: 1,
    idColumn: '',
    dateColumn: '',
    source: emptySource,
}

const findColumn = (
    columns: string[] | undefined,
    preferredNames: string[],
    preferredIndex: number
): string | undefined => {
    if (!columns) {
        return undefined
    }
    const preferredName = preferredNames.find((n) => columns.includes(n))
    if (preferredName) {
        return preferredName
    }
    if (columns[preferredIndex]) {
        return columns[preferredIndex]
    }
    return undefined
}

const findFreeColumns = (
    idColumn: string,
    dateColumn: string,
    columns: string[],
    dataColumns: string[]
): string[] => {
    if (columns.length === 0) {
        return []
    }
    const usedColumns: (string | undefined)[] = [idColumn, dateColumn, ...dataColumns]
    const freeColumns = columns.filter((c) => !usedColumns.includes(c))
    return freeColumns
}

const generateNextColumn = (state: UploaderState): string | undefined => {
    const { idColumn, dateColumn, datasets, csv } = state
    const dataColumns = Object.keys(datasets)
    const freeColumns = findFreeColumns(idColumn, dateColumn, csv?.meta?.fields ?? [], dataColumns)
    return freeColumns[0] ?? undefined
}

const generateNextDataset = (state: UploaderState): UploadDataset | undefined => {
    const column = generateNextColumn(state)
    if (!column) {
        return undefined
    }
    return {
        uuid: uuid(),
        column,
        name: column,
        units: '',
        description: '',
    }
}

const generateMetadata = (
    datasets: UploadDataset[],
    geographyType: number,
    idColumn: string,
    dateColumn: string,
    source: NewSource | DataSource,
    columns: string[] | undefined
): FormData | undefined => {
    if (columns === undefined) {
        return undefined
    }
    const dataColumns = datasets.map((d) => d.column)
    const freeColumns = findFreeColumns(idColumn, dateColumn, columns, dataColumns)
    return {
        datasets,
        geographyType,
        idColumn,
        dateColumn,
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
            state.idColumn =
                findColumn(
                    state.csv.meta.fields,
                    ['id', 'geo_id', 'county_id', 'state_id', 'country_id'],
                    0
                ) ?? ''
            state.dateColumn = findColumn(state.csv.meta.fields, ['date', 'year'], 1) ?? ''
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
        setDateColumn: (state, { payload }: { payload: string }) => {
            state.dateColumn = payload
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
            const dataset = state.datasets.find((d) => d.uuid === payload.uuid)
            // if dataset is an existing dataset id, it will not have a name
            if (dataset && 'name' in dataset) {
                Object.assign(dataset, payload)
            }
        },
        selectColumn: (state, { payload }: { payload: { uuid: string; newName: string } }) => {
            const { uuid, newName } = payload
            const dataset = state.datasets.find((d) => d.uuid === uuid)
            if (dataset) {
                dataset.column = newName

                if ('name' in dataset) {
                    dataset.name = newName
                }
            }
        },
        deleteDataset: (state, { payload }: { payload: string }) => {
            state.datasets = state.datasets.filter((d) => d.uuid !== payload)
        },
        toggleExistingSource: (state, { payload }: { payload: DataSource | undefined }) => {
            if (payload) state.source = payload
            else state.source = emptySource
        },
        setReplaceData: (
            state,
            { payload }: { payload: { replaceData: boolean; uuid: string } }
        ) => {
            const { uuid, replaceData } = payload
            const index = state.datasets.findIndex((d) => d.uuid === uuid)
            if (index === -1) {
                return
            }
            const dataset = state.datasets[index]
            if ('name' in dataset && replaceData) {
                state.datasets[index] = 
            }
        },
    },
})
export const {
    setCsv,
    createDataset,
    setGeographyType,
    setIdColumn,
    setDateColumn,
    setSourceName,
    setSourceLink,
    setSourceDescription,
    setExistingSource,
    onDatasetChange,
    selectColumn,
    deleteDataset,
    toggleExistingSource,
} = uploaderSlice.actions

export const selectCsv = (state: RootState) => state.uploader.csv

export const selectDataColumns = createSelector(
    (state: RootState) => state.uploader.datasets,
    (datasets) => Object.keys(datasets)
)

export const selectMetadata = createSelector(
    (state: RootState) => state.uploader.datasets,
    (state: RootState) => state.uploader.geographyType,
    (state: RootState) => state.uploader.idColumn,
    (state: RootState) => state.uploader.dateColumn,
    (state: RootState) => state.uploader.source,
    (state: RootState) => state.uploader.csv?.meta?.fields,
    generateMetadata
)

export default uploaderSlice.reducer
