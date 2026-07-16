import { ReactNode } from 'react'

/** A pure-CSS tooltip shown on hover or focus; the styling keys off data-tip */
export default function Tooltip({ tip, children }: { tip: string; children: ReactNode }) {
    return <span data-tip={tip}>{children}</span>
}
