import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import jsonFile from '../public/usa.json'
import Home from './Home'
import { MapVisualizationJson } from './MapVisualization'
import { render } from './test-utils'

// A visualization whose dataset has no data rows: the backend derives sources
// and date ranges from data, so both come back empty.
const MAP_VISUALIZATIONS: { [key: string]: { [key: string]: MapVisualizationJson } } = {
    '9': {
        '71': {
            id: 71,
            dataset: 69,
            map_type: 1,
            subcategory: 1,
            units: 'people',
            short_name: 'empty_map',
            name: null,
            dataset_name: 'Dataset with no data',
            description: 'A dataset whose data has been deleted',
            legend_ticks: null,
            color_palette: {
                id: 45,
                name: 'YlOrBr',
            },
            reverse_scale: false,
            invert_normalized: false,
            scale_type: {
                id: 5,
                name: 'SequentialSqrt',
            },
            color_domain: [4.0, 10.0],
            date_ranges_by_source: {},
            sources: {},
            show_pdf: true,
            pdf_domain: [],
            default_date_range: null,
            default_source: null,
            formatter_type: 3,
            legend_formatter_type: null,
            decimals: 0,
            legend_decimals: null,
            order: 1,
            geography_type: 1,
            bubble_color: '#000000',
        },
    },
}

const server = setupServer(
    rest.get('/api/map-visualization', (_, res, ctx) => res(ctx.json(MAP_VISUALIZATIONS))),
    rest.get('/api/data-category', (_, res, ctx) =>
        res(ctx.json([{ id: 9, name: 'health', normalized: false }]))
    ),
    rest.get('*.json', (_, res, ctx) => res(ctx.json(jsonFile)))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('It renders a visualization with no data without crashing', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </MemoryRouter>
    )
    // the visualization still appears in the data selector, map title, and description
    expect(
        await screen.findAllByText(/Dataset with no data/i, undefined, { timeout: 20_000 })
    ).toHaveLength(3)
    expect(
        await screen.findByText(/No data available for this map yet/i, undefined, {
            timeout: 20_000,
        })
    ).toBeInTheDocument()
}, 20_000)
