import { autoType, csv } from "d3";
import type { DSVParsedArray } from "d3";

const BASE_URL = "/api/data/";
export type DataQueryParams = {
    dataset: number,
    source: number,
    startDate: string,
    endDate: string,
};
type CsvRow = {
    state_id: number;
    county_id: number;
    value: number;
}
export type DatasetId = number;
export type CountyId = string;
export type Data = { [key in CountyId]: number | null };
const mergeFIPSCodes = (row: CsvRow): [CountyId, number | null] => {
    let stateId = row.state_id.toString();
    let countyId = row.county_id.toString();
    const value = row.value;

    stateId = "0".repeat(2 - stateId.length) + stateId;
    countyId = "0".repeat(3 - countyId.length) + countyId;
    return [stateId + countyId, value];
}
const transformData = (csv: DSVParsedArray<CsvRow>): Data => {
    return csv.reduce((accumulator, row) => {
        const [fips, value] = mergeFIPSCodes(row);
        accumulator[fips] = value;
        return accumulator;
    }, {} as Data);
}

export const getData = async ({ dataset, source, startDate, endDate }: DataQueryParams) => {
    const csvRow = await csv<CsvRow>(BASE_URL + dataset +
        "?source=" + source +
        "&start_date=" + startDate +
        "&end_date=" + endDate,
        autoType);
    return transformData(csvRow);
};