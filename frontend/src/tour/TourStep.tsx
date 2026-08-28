import { Fragment, ReactNode, useEffect, useState } from 'react'
import css from './tour.module.css'
import TourPopup from './TourPopup'

// The data structure for each step
export type TourStepData = {
    name: string
    description: string
    image?: string
    /** CSS selector; omit to show a centered popup with no highlight */
    targetElement?: string
    buttonText?: string

    end?: () => boolean
}

// The way that the steps should be given (an object)
type TourStepProps = {
    stepData: TourStepData
    children?: ReactNode
}

// only elements with a CSS box can be anchors: HTML elements or an
// outermost <svg>, never SVG internals
const isAnchorable = (el: Element | null): el is HTMLElement | SVGElement =>
    el instanceof HTMLElement || (el instanceof SVGElement && el.ownerSVGElement === null)

export function TourStep({ stepData, children }: TourStepProps) {
    // which selector currently carries the anchor tag — the ring and popup
    // bind to the anchor when they mount, so they must only mount once the
    // tag is on *this* step's target, never while it is still on the
    // previous step's
    const [anchoredTo, setAnchoredTo] = useState<string | null>(null)

    // tag the target as the highlight ring's CSS anchor; the browser does
    // all the positioning from there. The observer only tracks the target
    // existing or not — the tour can open before its target has rendered
    // (e.g. while map data loads) and targets can unmount mid-step.
    useEffect(() => {
        let tagged: HTMLElement | SVGElement | null = null
        const sync = () => {
            if (tagged && !tagged.isConnected) {
                tagged.style.removeProperty('anchor-name')
                tagged = null
            }
            if (!tagged) {
                const el = stepData.targetElement
                    ? document.querySelector(stepData.targetElement)
                    : null
                if (isAnchorable(el)) {
                    el.style.setProperty('anchor-name', '--tour-target')
                    tagged = el
                }
            }
            setAnchoredTo(tagged === null ? null : stepData.targetElement ?? null)
        }
        sync()
        const observer = new MutationObserver(sync)
        observer.observe(document.body, { childList: true, subtree: true })
        return () => {
            observer.disconnect()
            tagged?.style.removeProperty('anchor-name')
        }
    }, [stepData.targetElement])

    const anchored = anchoredTo !== null && anchoredTo === stepData.targetElement

    return (
        // key the ring and popup by target so each step mounts fresh
        // elements: the browser picks a position-try fallback per element
        // and does not revisit that choice when only the anchor tag moves
        // to another element, so a reused popup would keep the previous
        // step's placement (e.g. stay centered forever after a step whose
        // target filled the viewport)
        <Fragment key={stepData.targetElement ?? 'no-target'}>
            {anchored && <div className={css.tourHighlight} data-testid="tour-highlight" />}

            <TourPopup
                name={stepData.name}
                description={stepData.description}
                image={stepData.image}
                hasTarget={anchored}
            >
                {children}
            </TourPopup>
        </Fragment>
    )
}
