import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import { MapVisualizationJson } from './MapVisualization'
import { render } from './test-utils'
import jsonFile from './usa.json'

const MAP_VISUALIZATIONS: { [key: string]: { [key: string]: MapVisualizationJson } } = {
    '9': {
        '71': {
            id: 71,
            dataset: 69,
            map_type: 1,
            subcategory: 1,
            units: 'Âµg/mÂ³ (population weighted average)',
            short_name: 'PM2_5',
            name: null,
            dataset_name: 'Exposure to airborne particulate matter',
            description:
                'Gridded concentrations of fine particulate matter (PM2.5) (Di et al, 2021) are combined with gridded population data (CIESIN, 2018) to provide an estimate of the annual average level of PM2.5 experienced by the population of each county in the US. Link: Di et al, 2021 (https://doi.org/10.7927/0rvr-4538) and CIESIN, 2018 (https://doi.org/10.7927/H4F47M65)',
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
            date_ranges_by_source: {
                '12': [
                    {
                        start_date: '2015-01-01',
                        end_date: '2015-12-31',
                    },
                ],
            },
            sources: {
                '12': {
                    id: 12,
                    name: 'NASA Earth Data',
                    description:
                        'We downloaded data for annual 2015. To obtain population weighted PM2.5, we also used the following data: Land Area Data: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-land-water-area-rev11/data-download Population Density for 2015: https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-adjusted-to-2015-unwpp-country-totals-rev11',
                    link: 'https://beta.sedac.ciesin.columbia.edu/data/set/aqdh-pm2-5-concentrations-contiguous-us-1-km-2000-2016',
                },
            },
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
    rest.get('/api/map-visualization/71/data', (_, res, ctx) => res(ctx.text('id,value\n1,1'))),
    rest.get('*.json', (_, res, ctx) => res(ctx.json(jsonFile))),
    rest.get('/api/data/:id', (_, res, ctx) => res(ctx.text('state_id,county_id,value')))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('It shows header and loads data selector', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </MemoryRouter>
    )
    expect(screen.getByText(/STRESS Tool/i)).toBeInTheDocument()
    // map title, data selector, and description expander all have the same text
    expect(
        await screen.findAllByText(/Exposure to airborne particulate matter/i, undefined, {
            timeout: 20_000,
        })
    ).toHaveLength(3)
}, 20_000)
