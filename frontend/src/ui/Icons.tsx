import { SVGProps } from 'react'

/**
 * Inline SVG icons (paths from Material Design icons, Apache-2.0).
 * They inherit color from CSS `currentcolor`.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 24, children, ...rest }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentcolor"
            aria-hidden="true"
            {...rest}
        >
            {children}
        </svg>
    )
}

export function ExpandMore(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </Icon>
    )
}

export function Info(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </Icon>
    )
}

export function Delete(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </Icon>
    )
}

export function Mail(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </Icon>
    )
}

export function RssFeed(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="6.18" cy="17.82" r="2.18" />
            <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
        </Icon>
    )
}

export function GitHub(props: IconProps) {
    return (
        <Icon {...props}>
            <path
                fillRule="evenodd"
                d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
            />
        </Icon>
    )
}
