import { CSSProperties, ReactNode } from 'react'

type Props = {
    summary: ReactNode
    children: ReactNode
    defaultExpanded?: boolean
    className?: string
    style?: CSSProperties
}

/** A bare <details>/<summary> disclosure. Content is rendered unwrapped. */
export default function Accordion({
    summary,
    children,
    defaultExpanded = false,
    className,
    style,
}: Props) {
    return (
        <details className={className} style={style} open={defaultExpanded || undefined}>
            <summary>{summary}</summary>
            {children}
        </details>
    )
}
