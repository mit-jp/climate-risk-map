import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import jsonFile from '../public/usa.json'
import Home from './Home'
import { MapVisualizationJson } from './MapVisualization'
import { render } from './test-utils'
import TOUR_TARGET from './tour/tourTargets'

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
    http.get('/api/map-visualization', () => HttpResponse.json(MAP_VISUALIZATIONS)),
    http.get('/api/data-category', () =>
        HttpResponse.json([{ id: 9, name: 'health', normalized: false }])
    ),
    http.get('/api/map-visualization/71/data', () => HttpResponse.text('id,value\n1,1')),
    http.get(/\.json$/, () => HttpResponse.json(jsonFile)),
    http.get('/api/data/:id', () => HttpResponse.text('state_id,county_id,value'))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderHome = () =>
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </MemoryRouter>
    )

const waitForMap = async () => {
    // map title and data selector have the same text
    expect(
        await screen.findAllByText(/Exposure to airborne particulate matter/i, undefined, {
            timeout: 20_000,
        })
    ).toHaveLength(2)
}

test('It shows header and loads data selector', async () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: /STRESS/i })).toBeInTheDocument()
    await waitForMap()
}, 20_000)

// a CSS anchor is only valid if it is laid out before the element anchored
// to it, so the tour must stay the last thing Home renders. If this fails,
// the highlight ring silently detaches from every target.
test('the tour renders after every element it targets', async () => {
    renderHome()
    const popupHeading = await screen.findByRole('heading', {
        name: /Welcome to the STRESS Platform/i,
    })
    await waitForMap()

    const present = Object.values(TOUR_TARGET)
        // the targets are looked up by the same ids the tour itself uses;
        // this asserts a structural DOM-order invariant, not user behavior
        // eslint-disable-next-line testing-library/no-node-access
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
    // report-card-div only exists once a county is selected; everything else
    // should be on the page
    expect(present.length).toBeGreaterThanOrEqual(6)
    present.forEach((target) => {
        expect(
            // eslint-disable-next-line no-bitwise
            target.compareDocumentPosition(popupHeading) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
    })
}, 20_000)

test('the tour rings anchorable targets and centers the popup for the rest', async () => {
    renderHome()
    await screen.findByRole('heading', { name: /Welcome to the STRESS Platform/i })
    await waitForMap()

    // step 1 targets the map svg, which renders after the tour opens; the
    // ring must catch up once it appears
    expect(await screen.findByTestId('tour-highlight')).toBeInTheDocument()
    expect(screen.getByTestId('tour-popup')).not.toHaveClass('centered')

    // step 2 explains the legend, which lives inside the map svg where CSS
    // anchors can't reach: centered popup, no ring
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await screen.findByRole('heading', { name: /The Relative Risk Tool/i })
    expect(screen.getByTestId('tour-popup')).toHaveClass('centered')
    expect(screen.queryByTestId('tour-highlight')).not.toBeInTheDocument()

    // step 3 anchors to the sidebar
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await screen.findByRole('heading', { name: /sidebar/i })
    expect(screen.getByTestId('tour-popup')).not.toHaveClass('centered')
    expect(screen.getByTestId('tour-highlight')).toBeInTheDocument()
}, 20_000)
