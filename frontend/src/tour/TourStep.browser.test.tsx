// real-Chromium tests for the tour's CSS anchor positioning: the popup
// must sit next to its target when there is room, center itself only as
// a last resort, and re-position when the step or scroll changes. jsdom
// does no layout, so these run in vitest browser mode.
import { page } from 'vitest/browser'
import { render, screen } from '@testing-library/react'
import '../ui/ui.css'
import { TourStep, TourStepData } from './TourStep'

const step = (targetElement?: string, description = 'A step for testing'): TourStepData => ({
    name: 'Test step',
    description,
    targetElement,
})

const settle = async () => {
    // give the browser a couple of frames to run effects, resolve anchor
    // positioning, and re-evaluate position-try fallbacks
    for (let i = 0; i < 3; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve))
        })
    }
}

const rect = (testId: string) => screen.getByTestId(testId).getBoundingClientRect()

const expectAnchored = (popup: DOMRect, target: DOMRect) => {
    const below = popup.top >= target.bottom && popup.top - target.bottom < 60
    const above = popup.bottom <= target.top && target.top - popup.bottom < 60
    expect(
        below || above,
        `popup (${Math.round(popup.top)}..${Math.round(popup.bottom)}) should hug target ` +
            `(${Math.round(target.top)}..${Math.round(target.bottom)}), not float elsewhere`
    ).toBe(true)
}

const expectInViewport = (popup: DOMRect) => {
    expect(popup.top).toBeGreaterThanOrEqual(0)
    expect(popup.left).toBeGreaterThanOrEqual(0)
    expect(popup.bottom).toBeLessThanOrEqual(window.innerHeight)
    expect(popup.right).toBeLessThanOrEqual(window.innerWidth)
}

const mountButton = (id: string, style: React.CSSProperties) => {
    render(
        <button id={id} data-testid={id} type="button" style={{ position: 'fixed', ...style }}>
            {id}
        </button>
    )
}

beforeEach(async () => {
    await page.viewport(1104, 850)
    window.scrollTo(0, 0)
})

test('popup sits below a target near the top', async () => {
    mountButton('top-target', { top: 100, left: 300, width: 140, height: 40 })
    render(<TourStep stepData={step('#top-target')} />)
    await settle()

    const popup = rect('tour-popup')
    expect(popup.top).toBeGreaterThanOrEqual(rect('top-target').bottom)
    expectAnchored(popup, rect('top-target'))
    expectInViewport(popup)
})

test('popup flips above a target near the bottom', async () => {
    mountButton('bottom-target', { top: 750, left: 300, width: 140, height: 40 })
    render(<TourStep stepData={step('#bottom-target')} />)
    await settle()

    const popup = rect('tour-popup')
    expect(popup.bottom).toBeLessThanOrEqual(rect('bottom-target').top)
    expectAnchored(popup, rect('bottom-target'))
    expectInViewport(popup)
})

test('popup centers in the viewport only when the target fills it', async () => {
    mountButton('huge-target', { top: 0, left: 0, width: 1104, height: 850 })
    render(<TourStep stepData={step('#huge-target')} />)
    await settle()

    const popup = rect('tour-popup')
    const popupCenter = (popup.top + popup.bottom) / 2
    expect(Math.abs(popupCenter - window.innerHeight / 2)).toBeLessThan(30)
    expectInViewport(popup)
})

test('popup re-anchors when the step moves from a huge target to a small one', async () => {
    // reproduces the app flow: the welcome step covers the whole map (popup
    // centers), then the next step targets a small control — the popup
    // element persists across the rerender and must leave the centered
    // fallback behind
    mountButton('huge-target', { top: 0, left: 0, width: 1104, height: 850 })
    mountButton('small-target', { top: 600, left: 700, width: 140, height: 40 })
    const view = render(<TourStep stepData={step('#huge-target')} />)
    await settle()

    view.rerender(<TourStep stepData={step('#small-target')} />)
    await settle()

    const popup = rect('tour-popup')
    expectAnchored(popup, rect('small-target'))
    expectInViewport(popup)

    // the highlight ring must move to the new target too
    const ring = rect('tour-highlight')
    const target = rect('small-target')
    expect(Math.abs(ring.top - (target.top - 4))).toBeLessThan(2)
    expect(Math.abs(ring.left - (target.left - 4))).toBeLessThan(2)
})

test('popup follows its target while the page scrolls', async () => {
    render(<div style={{ height: 3000 }} />)
    render(
        <button
            id="flow-target"
            data-testid="flow-target"
            type="button"
            style={{ position: 'absolute', top: 1200, left: 300, width: 140, height: 40 }}
        >
            flow-target
        </button>
    )
    render(<TourStep stepData={step('#flow-target')} />)

    window.scrollTo(0, 1100) // target near the top of the viewport
    await settle()
    expectAnchored(rect('tour-popup'), rect('flow-target'))
    expectInViewport(rect('tour-popup'))

    window.scrollTo(0, 500) // target near the bottom of the viewport
    await settle()
    expectAnchored(rect('tour-popup'), rect('flow-target'))
    expectInViewport(rect('tour-popup'))
})
