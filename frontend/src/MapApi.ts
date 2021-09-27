import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { autoType, csv, DSVParsedArray } from 'd3';
import { ColorPalette, fetchMapVisualizations, MapVisualizationByTabId } from './MapVisualization';

export type CountyId = string;
export type DatasetId = number;
export type DataRow = { [key in DatasetId]: number | null };
export type Data = { [key in CountyId]: number | null };
export type DataByDataset = { [key in DatasetId]: Data };
export type DataQueryParams = {
    dataset: number,
    source: number,
    startDate: string,
    endDate: string,
};
export type Tab = { id: number, name: string };

type CsvRow = {
    state_id: number;
    county_id: number;
    value: number;
}

const mergeFIPSCodes = (row: CsvRow): [CountyId, number | null] => {
    let stateId = row.state_id.toString();
    let countyId = row.county_id.toString();
    const value = row.value;

    stateId = "0".repeat(2 - stateId.length) + stateId;
    countyId = "0".repeat(3 - countyId.length) + countyId;
    return [stateId + countyId, value];
}

const transformData = (loadedCsvs: [dataset: number, csv: DSVParsedArray<CsvRow>][]): DataByDataset => {
    const allData: DataByDataset = {};
    for (const [dataset, csv] of loadedCsvs) {
        const dataByCountyId = csv.reduce((accumulator, row) => {
            const [fips, value] = mergeFIPSCodes(row);
            accumulator[fips] = value;
            return accumulator;
        }, {} as Data);
        allData[dataset] = dataByCountyId;
    }
    return allData;
}

export const mapApi = createApi({
    reducerPath: "mapApi",
    keepUnusedDataFor: 5 * 60, // 5 minutes
    baseQuery: fetchBaseQuery({ baseUrl: "api/" }),
    endpoints: (builder) => ({
        getData: builder.query<DataByDataset, DataQueryParams[]>({
            queryFn: (queryParams) => {
                const loadingCsvs = queryParams.map(async ({ dataset, source, startDate, endDate }) => {
                    const csvRow = await csv<CsvRow>("api/data/" + dataset +
                        "?source=" + source +
                        "&start_date=" + startDate +
                        "&end_date=" + endDate, autoType);
                    return [dataset, csvRow] as [number, DSVParsedArray<CsvRow>];
                });
                return Promise
                    .all(loadingCsvs)
                    .then(transformData)
                    .then(
                        data => ({ data }),
                        failure => ({ error: failure })
                    );
            }
        }),
        getMapVisualizations: builder.query<MapVisualizationByTabId, undefined>({
            queryFn: () => fetchMapVisualizations().then(
                data => ({ data }),
                error => ({ error })
            ),
        }),
        getTabs: builder.query<Tab[], undefined>({
            query: () => "data-category",
        }),
        getColorPalettes: builder.query<ColorPalette[], undefined>({
            query: () => "color-palette",
        }),
    }),
});

export const {
    useLazyGetDataQuery,
    useGetDataQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
    useGetColorPalettesQuery,
} = mapApi;