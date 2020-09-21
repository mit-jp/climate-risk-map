import * as scales from 'd3-scale-chromatic';

type Data = {
    name: string,
    units: string,
    formatter: (value: number) => string,
    color: ReadonlyArray<ReadonlyArray<string>>,
    scale: number[]
}

const dataTypes: { [key: string]: Data } = {
    GDP2018: {
        name: "GDP 2018",
        units: "USD",
        formatter: value => new Intl.NumberFormat(
            undefined,
            {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }
        ).format(value),
        color: scales.schemeGreens,
        scale: [0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]
    },
    AWATER: {
        name: "Water Area",
        units: "square miles",
        formatter: value => value + " sq miles",
        color: scales.schemeBlues,
        scale: [0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000]
    }
};

export default dataTypes;