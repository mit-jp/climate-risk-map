import * as scales from 'd3-scale-chromatic';

type Data = {
    name: string,
    units: string,
    color: ReadonlyArray<ReadonlyArray<string>>,
    scale: number[]
}

const dataTypes: { [key: string]: Data } = {
    GDP2018: {
        name: "GDP 2018",
        units: "USD",
        color: scales.schemeGreens,
        scale: [0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]
    },
    AWATER: {
        name: "Water Area",
        units: "square miles",
        color: scales.schemeBlues,
        scale: [0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]
    }
};

export default dataTypes;