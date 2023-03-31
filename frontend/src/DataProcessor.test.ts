import { Map } from 'immutable'
import DataProcessor from './DataProcessor'

const DATA = {
    1: {
        1: 1,
        2: 2,
        3: 3,
    },
}
const DATA_2 = {
    2: {
        1: 100,
        2: 20,
        3: 30,
    },
}

test('it returns a single dataset, not normalized', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
        })
    ).toEqual(Map({ 1: 1, 2: 2, 3: 3 }))
})

test('it returns a single dataset, normalized', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
            normalize: true,
        })
    ).toEqual(Map({ 1: 0, 2: 0.5, 3: 1 }))
})

test('it returns two datasets, added, if they are both selected', () => {
    expect(
        DataProcessor({
            data: { ...DATA, ...DATA_2 },
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
        })
    ).toEqual(Map({ 1: 101, 2: 22, 3: 33 }))
})

test('it returns two datasets, normalized then averaged, if they are both selected', () => {
    expect(
        DataProcessor({
            data: { ...DATA, ...DATA_2 },
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
            normalize: true,
        })
    ).toEqual(Map({ 1: 0.5, 2: 0.25, 3: 0.75 }))
})

test("it returns undefined if dataset isn't loaded", () => {
    expect(
        DataProcessor({
            data: {},
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
        })
    ).toBeUndefined()
})

test('it returns undefined if no datasets are selected', () => {
    expect(DataProcessor({ data: DATA, params: [] })).toBeUndefined()
})

test('it ignores geo ids that are missing from one dataset', () => {
    expect(
        DataProcessor({
            data: {
                1: { 1: 1 },
                2: { 1: 10, 2: 20 },
            },
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
        })
    ).toEqual(Map({ 1: 11 }))
})

test('it weights datasets when normalizing', () => {
    expect(
        DataProcessor({
            data: { ...DATA, ...DATA_2 },
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 3, invertNormalized: false },
            ],
            normalize: true,
        })
    ).toEqual(Map({ 1: 0.75, 2: 0.125, 3: 0.625 }))
})

test("it doesn't weight datasets when not normalizing", () => {
    expect(
        DataProcessor({
            data: { ...DATA, ...DATA_2 },
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 2, invertNormalized: false },
            ],
        })
    ).toEqual(Map({ 1: 101, 2: 22, 3: 33 }))
})

test('it filters geoIds', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
            filter: (geoId) => geoId !== '2',
        })
    ).toEqual(Map({ 1: 1, 3: 3 }))
})

test('it filters by geoIds, then normalizes with respect to only those ids', () => {
    expect(
        DataProcessor({
            data: { ...DATA },
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
            filter: (geoId) => geoId !== '3',
            normalize: true,
        })
    ).toEqual(Map({ 1: 0, 2: 1 }))
})

test('it excludes null values', () => {
    expect(
        DataProcessor({
            data: {
                1: { 1: 1, 2: null },
            },
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
        })
    ).toEqual(Map({ 1: 1 }))
})
