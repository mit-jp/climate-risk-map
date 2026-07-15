import { ReactNode } from 'react'

/** A pure-CSS tooltip shown on hover or focus. */
export default function Tooltip({ tip, children }: { tip: string; children: ReactNode }) {
    return (
        <span className="ui-tooltip" data-tip={tip}>
            {children}
        </span>
    )
}
