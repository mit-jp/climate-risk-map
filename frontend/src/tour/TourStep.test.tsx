import { render, screen, waitFor } from '@testing-library/react'
import { readFileSync } from 'fs'
import { join } from 'path'
import { TourStep, TourStepData } from './TourStep'

const css = readFileSync(join(import.meta.dirname, 'tour.module.css'), 'utf8')

const step = (targetElement?: string): TourStepData => ({
    name: 'Test step',
    description: 'A step for testing',
    targetElement,
})

const ring = () => screen.queryByTestId('tour-highlight')
const popup = () => screen.getByTestId('tour-popup')

// fixtures render through RTL so cleanup and act() are handled for us
const mountTarget = (id: string) => {
    render(
        <button id={id} type="button">
            {id}
        </button>
    )
    return screen.getByRole('button', { name: id })
}

const mountSvg = () => {
    render(
        <svg id="outer" data-testid="outer">
            <svg id="inner" data-testid="inner" />
        </svg>
    )
    return { outer: screen.getByTestId('outer'), inner: screen.getByTestId('inner') }
}

test('tags an HTML target as the ring anchor and shows the ring', () => {
    const target = mountTarget('target')
    const setProperty = vi.spyOn(target.style, 'setProperty')

    render(<TourStep stepData={step('#target')} />)

    expect(setProperty).toHaveBeenCalledWith('anchor-name', '--tour-target')
    expect(ring()).toBeInTheDocument()
    expect(popup()).not.toHaveClass('centered')
})

test('an outermost svg is a valid anchor', () => {
    const { outer } = mountSvg()
    const setProperty = vi.spyOn(outer.style, 'setProperty')

    render(<TourStep stepData={step('#outer')} />)

    expect(setProperty).toHaveBeenCalledWith('anchor-name', '--tour-target')
    expect(ring()).toBeInTheDocument()
})

test('svg internals cannot be anchors: the popup centers and no ring shows', () => {
    const { inner } = mountSvg()
    const setProperty = vi.spyOn(inner.style, 'setProperty')

    render(<TourStep stepData={step('#inner')} />)

    expect(setProperty).not.toHaveBeenCalled()
    expect(ring()).not.toBeInTheDocument()
    expect(popup()).toHaveClass('centered')
})

test('a step without a target centers the popup', () => {
    render(<TourStep stepData={step(undefined)} />)

    expect(ring()).not.toBeInTheDocument()
    expect(popup()).toHaveClass('centered')
})

test('a selector that matches nothing centers the popup', () => {
    render(<TourStep stepData={step('#does-not-exist')} />)

    expect(ring()).not.toBeInTheDocument()
    expect(popup()).toHaveClass('centered')
})

test('moves the anchor tag when the step changes', () => {
    const target = mountTarget('target')
    const other = mountTarget('other')
    const removeProperty = vi.spyOn(target.style, 'removeProperty')
    const setOther = vi.spyOn(other.style, 'setProperty')

    const { rerender } = render(<TourStep stepData={step('#target')} />)
    rerender(<TourStep stepData={step('#other')} />)

    expect(removeProperty).toHaveBeenCalledWith('anchor-name')
    expect(setOther).toHaveBeenCalledWith('anchor-name', '--tour-target')
})

test('removes the anchor tag when the tour closes', () => {
    const target = mountTarget('target')
    const removeProperty = vi.spyOn(target.style, 'removeProperty')

    const { unmount } = render(<TourStep stepData={step('#target')} />)
    unmount()

    expect(removeProperty).toHaveBeenCalledWith('anchor-name')
})

test('tags a target that renders after the step opens', async () => {
    render(<TourStep stepData={step('#late')} />)
    expect(ring()).not.toBeInTheDocument()

    const late = mountTarget('late')
    const setProperty = vi.spyOn(late.style, 'setProperty')

    await waitFor(() => expect(ring()).toBeInTheDocument())
    expect(setProperty).toHaveBeenCalledWith('anchor-name', '--tour-target')
    expect(popup()).not.toHaveClass('centered')
})

test('drops the ring when the target leaves the DOM mid-step', async () => {
    const { unmount } = render(
        <button id="target" type="button">
            target
        </button>
    )
    render(<TourStep stepData={step('#target')} />)
    expect(ring()).toBeInTheDocument()

    unmount()

    await waitFor(() => expect(ring()).not.toBeInTheDocument())
    expect(popup()).toHaveClass('centered')
})

// the anchor name wires TourStep to tour.module.css: TourStep tags the
// target with it, and the CSS positions both the ring and the popup on
// that tag. Renaming either side alone breaks the tour silently, so pin
// the contract here.
describe('tour.module.css anchor contract', () => {
    test('the ring and the popup both pin themselves to the name TourStep sets on the target', () => {
        expect(css.match(/position-anchor: --tour-target/g)).toHaveLength(2)
    })

    test('the popup anchors the target directly — anchoring it to the fixed-position ring would not track scrolling', () => {
        expect(css).not.toContain('--tour-anchor')
    })

    test('the popup fallback chain is exactly flip-block, then centered in the viewport', () => {
        // keep this list minimal: inline flips are no-ops for a block-end
        // area, and with them in the list Chrome skipped fallbacks that
        // fit and jumped straight to the centered one
        expect(css).toMatch(/position-try-fallbacks: flip-block, --tour-popup-center;/)
        expect(css).toContain('@position-try --tour-popup-center')
    })
})
