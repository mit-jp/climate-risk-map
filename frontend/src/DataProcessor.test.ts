import { Map } from 'immutable'
import DataProcessor from './DataProcessor'
import { Data2 } from './MapApi'

const DATA = Map<number, Data2>([
    [
        1,
        [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
        ],
    ],
])
const DATA_2 = Map<number, Data2>([
    [
        2,
        [
            [0, 0],
            [1, 100],
            [2, 20],
            [3, 30],
            [4, 40],
        ],
    ],
])
const DATA_3 = Map<number, Data2>([
    [
        3,
        [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
        ],
    ],
])

test('it returns a single dataset, not normalized', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
        ])
    )
})

test('it returns a single dataset, normalized', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
            normalize: true,
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 0.25],
            [2, 0.5],
            [3, 0.75],
            [4, 1],
        ])
    )
})

test('it returns two datasets, added, if they are both selected', () => {
    expect(
        DataProcessor({
            data: DATA.concat(DATA_2),
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 101],
            [2, 22],
            [3, 33],
            [4, 44],
        ])
    )
})

test('it returns two datasets, normalized then averaged, if they are both selected', () => {
    expect(
        DataProcessor({
            data: DATA.concat(DATA_2),
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
            normalize: true,
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 0.625],
            [2, 0.375],
            [3, 0.625],
            [4, 0.875],
        ])
    )
})

test("it returns undefined if dataset isn't loaded", () => {
    expect(
        DataProcessor({
            data: Map(),
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
            data: Map<number, Data2>([
                [1, [[1, 1]]],
                [
                    2,
                    [
                        [1, 10],
                        [2, 20],
                    ],
                ],
            ]),
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 1, invertNormalized: false },
            ],
        })
    ).toEqual(Map([[1, 11]]))
})

test('it weights datasets when normalizing', () => {
    expect(
        DataProcessor({
            data: DATA.concat(DATA_2),
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 3, invertNormalized: false },
            ],
            normalize: true,
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 0.8125],
            [2, 0.3125],
            [3, 0.5625],
            [4, 0.8125],
        ])
    )
})

test("it doesn't weight datasets when not normalizing", () => {
    expect(
        DataProcessor({
            data: DATA.concat(DATA_2),
            params: [
                { mapId: 1, weight: 1, invertNormalized: false },
                { mapId: 2, weight: 2, invertNormalized: false },
            ],
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 101],
            [2, 22],
            [3, 33],
            [4, 44],
        ])
    )
})

test('it filters geoIds', () => {
    expect(
        DataProcessor({
            data: DATA,
            params: [{ mapId: 1, weight: 1, invertNormalized: false }],
            filter: (geoId) => geoId !== 2,
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 1],
            [3, 3],
            [4, 4],
        ])
    )
})

test('it filters by geoIds, then normalizes with respect to only those ids', () => {
    expect(
        DataProcessor({
            data: DATA_3,
            params: [{ mapId: 3, weight: 1, invertNormalized: false }],
            filter: (geoId) => geoId !== 3,
            normalize: true,
        })
    ).toEqual(
        Map([
            [0, 0],
            [1, 0.5],
            [2, 0.1],
        ])
    )
})
