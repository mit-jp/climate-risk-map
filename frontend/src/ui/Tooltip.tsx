import { ReactNode } from 'react'
import useId from './useId'

/**
 * Clicking the children toggles a dark hint beside them — no JavaScript.
 * The trigger is a native popover invoker, so the hint renders in the
 * top layer anchored to it, shifts to stay on screen near viewport
 * edges, and light-dismisses on outside click or Esc.
 */
export default function Tooltip({ tip, children }: { tip: string; children: ReactNode }) {
    const id = useId('tooltip')
    return (
        <>
            <button
                type="button"
                aria-label="more information"
                popovertarget={id}
                className="ui-icon-button"
            >
                {children}
            </button>
            <div id={id} popover="auto" className="ui-tooltip">
                {tip}
            </div>
        </>
    )
}
