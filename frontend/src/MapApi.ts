import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DSVParsedArray, autoType, csv as loadCsv } from 'd3'
import { Map } from 'immutable'
import { Dataset, DatasetPatch } from './Dataset'
import {
    ColorPalette,
    MapVisualization,
    MapVisualizationId,
    MapVisualizationPatch,
    ScaleType,
    applyPatch,
    fetchMapVisualization,
    fetchMapVisualizations,
    fetchMapVisualizationsByDataset,
} from './MapVisualization'
import { GeoId } from './appSlice'
import UploadData from './uploader/UploadData'

export type DatasetId = number
export type TabId = number
export type Data = Record<GeoId, number | null>
export type DataByMapVisualization = Record<MapVisualizationId, Data>
export type DataQueryParams = {
    mapVisualization: number
    source: number
    startDate: string
    endDate: string
}
export type MapVisualizationQueryParams = {
    includeDrafts?: boolean
    geographyType?: number
}
export type Tab = {
    id: TabId
    name: string
    normalized: boolean
    order: number
}
export type NewTab = {
    name: string
    normalized: boolean
}
export type DataSource = {
    id: number
    name: string
    description: string
    link: string
}
export type DataSourcePatch = {
    id: number
    name?: string
    description?: string
    link?: string
}
export type County = { id: number; name: string }
export type State = { id: number; name: string }
export type PercentileQueryParams = {
    geoId: number
    category: number
    geographyType: number
}
export type Subcategory = {
    id: number
    name: string
}

export type PercentileRow = {
    name: string
    source: number
    startDate: string
    endDate: string
    percentRank: number
    value: number
    units: string
    formatter_type: number
    decimals: number
}

export type Percentiles = {
    [key in DatasetId]: PercentileRow
}

type CountyCsvRow = {
    dataset: number
    dataset_name: string
    source: number
    start_date: string
    end_date: string
    percent_rank: number
    value: number
    units: string
    formatter_type: number
    decimals: number
}
type MapVisualizationCollectionId = {
    map_visualization: number
    category: number
}

export type CsvRow = {
    id: number
    value: number
}
export type GeographyType = {
    id: number
    name: string
}

export type UploadError =
    | {
          name: 'MissingColumn'
          info: {
              column: string
              row: number
              record: Record<string, string>
          }
      }
    | {
          name: 'GeoIdNotNumeric'
          info: {
              geo_id: string
              row: number
          }
      }
    | {
          name: 'InvalidGeoIds'
          info: [
              {
                  id: number
                  geography_type: number
              }
          ]
      }
    | {
          name: 'DuplicateDataInCsv'
          info: {
              row: number
              parsed_data: {
                  dataset: string
                  start_date: string
                  end_date: string
                  id: number
                  value?: number
              }
          }
      }
    | {
          name: 'DuplicateDatasets'
          info: [
              {
                  id: number
                  short_name: string
                  name: string
                  description: string
                  geography_type: number
                  units: string
              }
          ]
      }
    | {
          name: 'DuplicateDataSource'
          info: {
              id: number
              name: string
              description: string
              link: string
          }
      }
    | { name: 'DataSourceIncomplete' }
    | { name: 'DataSourceLinkInvalid'; info: string }
    | { name: 'MissingMetadata' }
    | { name: 'InvalidMetadata'; info: string }
    | { name: 'MissingFile' }
    | { name: 'Internal'; info: string }
    | { name: 'InvalidYear'; info: { year: string; row: number } }
    | { name: 'InvalidCsv'; info: string }

const transformCountySummary = (csv: DSVParsedArray<CountyCsvRow>): Percentiles => {
    const countySummary: Percentiles = {}
    csv.forEach((row) => {
        countySummary[row.dataset] = {
            name: row.dataset_name,
            source: row.source,
            startDate: row.start_date,
            endDate: row.end_date,
            percentRank: row.percent_rank,
            value: row.value,
            units: row.units,
            formatter_type: row.formatter_type,
            decimals: row.decimals,
        }
    })
    return countySummary
}

export type Data2 = [GeoId, number][]
const transformData = (dataByMapId: [number, DSVParsedArray<CsvRow>][]): Map<number, Data2> =>
    Map(dataByMapId.map(([mapId, data]) => [mapId, data.map((row) => [row.id, row.value])]))

export const mapApi = createApi({
    reducerPath: 'mapApi',
    keepUnusedDataFor: 5 * 60, // 5 minutes
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['MapVisualization', 'Dataset', 'Subcategory', 'Tab', 'DataSource'],
    endpoints: (builder) => ({
        getCounties: builder.query<Record<GeoId, County>, undefined>({
            query: () => 'county',
        }),
        getStates: builder.query<Record<GeoId, State>, undefined>({
            query: () => 'state',
        }),
        getPercentiles: builder.query<Percentiles, PercentileQueryParams>({
            queryFn: ({ geoId, category, geographyType }) => {
                const loadingCsv = loadCsv<CountyCsvRow>(
                    `/api/percentile?geo_id=${geoId}&category=${category}&geography_type=${geographyType}`,
                    autoType
                )
                return loadingCsv.then(transformCountySummary).then(
                    (data) => ({ data }),
                    (failure) => ({ error: failure })
                )
            },
        }),
        getStatePercentiles: builder.query<Percentiles, PercentileQueryParams>({
            queryFn: ({ geoId, category, geographyType }) => {
                const loadingCsv = loadCsv<CountyCsvRow>(
                    `/api/state_percentile?geo_id=${geoId}&category=${category}&geography_type=${geographyType}`,
                    autoType
                )
                return loadingCsv.then(transformCountySummary).then(
                    (data) => ({ data }),
                    (failure) => ({ error: failure })
                )
            },
        }),
        getData: builder.query<Map<number, Data2>, DataQueryParams[]>({
            queryFn: (queryParams) => {
                const loadingCsvs = queryParams.map(
                    async ({ mapVisualization, source, startDate, endDate }) => {
                        const csvRow = await loadCsv<CsvRow>(
                            `/api/map-visualization/${mapVisualization}/data?source=${source}&start_date=${startDate}&end_date=${endDate}`,
                            autoType
                        )
                        return [mapVisualization, csvRow] as [number, DSVParsedArray<CsvRow>]
                    }
                )
                return Promise.all(loadingCsvs)
                    .then(transformData)
                    .then(
                        (data) => ({ data }),
                        (failure) => ({ error: failure })
                    )
            },
        }),
        getMapVisualization: builder.query<MapVisualization, number>({
            queryFn: (id) =>
                fetchMapVisualization(id).then(
                    (data) => ({ data }),
                    (error) => ({ error })
                ),
            providesTags: (_result, _error, id) => [{ type: 'MapVisualization', id }],
        }),
        getMapVisualizations: builder.query<
            Record<TabId, Record<MapVisualizationId, MapVisualization>>,
            MapVisualizationQueryParams
        >({
            queryFn: (params) =>
                fetchMapVisualizations(params).then(
                    (data) => ({ data }),
                    (error) => ({ error })
                ),
            providesTags: (data) =>
                data
                    ? [
                          ...Object.values(data)
                              .map((mapsById) => Object.keys(mapsById))
                              .flat()
                              .map((id) => ({ type: 'MapVisualization', id } as const)),
                          { type: 'MapVisualization', id: 'ALL' },
                      ]
                    : [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        getMapVisualizationsByDataset: builder.query<
            Record<TabId, Record<MapVisualizationId, MapVisualization>>,
            number
        >({
            queryFn: (dataset) =>
                fetchMapVisualizationsByDataset(dataset).then(
                    (data) => ({ data }),
                    (error) => ({ error })
                ),
            providesTags: [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        getTabs: builder.query<Tab[], boolean>({
            query: (includeDrafts) => `data-category?include_drafts=${includeDrafts}`,
            providesTags: ['Tab'],
        }),
        getColorPalettes: builder.query<ColorPalette[], undefined>({
            query: () => 'color-palette',
        }),
        getScaleTypes: builder.query<ScaleType[], undefined>({
            query: () => 'scale-type',
        }),
        updateMapVisualization: builder.mutation<MapVisualization, MapVisualizationPatch>({
            query: (patch) => ({
                url: 'editor/map-visualization',
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'MapVisualization', id }],
            async onQueryStarted(patch, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    mapApi.util.updateQueryData('getMapVisualization', patch.id, (draft) =>
                        applyPatch(draft, patch)
                    )
                )
                queryFulfilled.catch(() => patchResult.undo())
            },
        }),
        createMapVisualization: builder.mutation<MapVisualization, undefined>({
            query: () => ({
                url: 'editor/map-visualization',
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        deleteMapVisualization: builder.mutation<undefined, number>({
            query: (id) => ({
                url: `editor/map-visualization/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        getDatasets: builder.query<Dataset[], undefined>({
            query: () => 'dataset',
            providesTags: ['Dataset'],
        }),
        updateDataset: builder.mutation<undefined, DatasetPatch>({
            query: (patch) => ({
                url: 'editor/dataset',
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Dataset', 'MapVisualization'],
        }),
        getDataSources: builder.query<DataSource[], undefined>({
            query: () => 'data-source',
            providesTags: ['DataSource'],
        }),
        updateDataSource: builder.mutation<undefined, DataSourcePatch>({
            query: (patch) => ({
                url: 'editor/data-source',
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['DataSource', 'MapVisualization'],
        }),
        getSubcategories: builder.query<Subcategory[], undefined>({
            query: () => 'subcategory',
            providesTags: ['Subcategory'],
        }),
        publishMapVisualization: builder.mutation<MapVisualization, MapVisualizationCollectionId>({
            query: (id) => ({
                url: `editor/map-visualization-collection`,
                method: 'POST',
                body: id,
            }),
            invalidatesTags: [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        unpublishMapVisualization: builder.mutation<MapVisualization, MapVisualizationCollectionId>(
            {
                query: (id) => ({
                    url: `editor/map-visualization-collection`,
                    method: 'DELETE',
                    body: id,
                }),
                invalidatesTags: [{ type: 'MapVisualization', id: 'ALL' }],
            }
        ),
        updateTab: builder.mutation<undefined, Tab>({
            query: (patch) => ({
                url: 'editor/data-category',
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Tab'],
            async onQueryStarted(patch, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    mapApi.util.updateQueryData('getTabs', true, (draft) =>
                        Object.assign(draft, { [patch.id]: patch })
                    )
                )
                queryFulfilled.catch(() => patchResult.undo())
            },
        }),
        createTab: builder.mutation<Tab, NewTab>({
            query: (tab) => ({
                url: 'editor/data-category',
                method: 'POST',
                body: tab,
            }),
            invalidatesTags: ['Tab'],
        }),
        deleteTab: builder.mutation<undefined, number>({
            query: (tabId) => ({
                url: `editor/data-category/${tabId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tab'],
            async onQueryStarted(tabId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    mapApi.util.updateQueryData('getTabs', true, (draft) => {
                        // eslint-disable-next-line no-param-reassign
                        delete draft[tabId]
                        return draft
                    })
                )
                queryFulfilled.catch(() => patchResult.undo())
            },
        }),
        upload: builder.mutation<undefined, UploadData>({
            queryFn: ({ file, ...metadata }) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('metadata', JSON.stringify(metadata))
                return fetch('api/editor/upload', {
                    method: 'POST',
                    body: formData,
                }).then(
                    (response) => {
                        if (response.ok) {
                            return { data: undefined }
                        }
                        if (response.status === 400) {
                            return response.json().then((error) => ({ error }))
                        }
                        return { error: new Error('Unknown error') }
                    },
                    (error) => ({ error })
                )
            },
            invalidatesTags: ['Dataset'],
        }),
        getGeographyTypes: builder.query<GeographyType[], undefined>({
            query: () => 'geography-type',
        }),
        deleteDataset: builder.mutation<undefined, number>({
            query: (datasetId) => ({
                url: `editor/dataset/${datasetId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Dataset', 'MapVisualization'],
        }),
        deleteDataSource: builder.mutation<undefined, number>({
            query: (dataSourceId) => ({
                url: `editor/data-source/${dataSourceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DataSource'],
        }),
    }),
})

export const {
    useLazyGetDataQuery,
    useGetDataQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
    useGetColorPalettesQuery,
    useGetScaleTypesQuery,
    useGetMapVisualizationQuery,
    useUpdateMapVisualizationMutation,
    useCreateMapVisualizationMutation,
    useGetDatasetsQuery,
    useGetCountiesQuery,
    useGetStatesQuery,
    useGetPercentilesQuery,
    useGetStatePercentilesQuery,
    useGetSubcategoriesQuery,
    useUnpublishMapVisualizationMutation,
    usePublishMapVisualizationMutation,
    useUpdateTabMutation,
    useCreateTabMutation,
    useDeleteTabMutation,
    useUpdateDatasetMutation,
    useUpdateDataSourceMutation,
    useUploadMutation,
    useGetDataSourcesQuery,
    useGetGeographyTypesQuery,
    useDeleteDatasetMutation,
    useGetMapVisualizationsByDatasetQuery,
    useDeleteMapVisualizationMutation,
    useDeleteDataSourceMutation,
} = mapApi
