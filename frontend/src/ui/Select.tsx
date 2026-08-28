import { ReactNode, SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
    children: ReactNode
}

/**
 * A native <select> (already styled bare) with an optional stacked label —
 * the wrapping <label> and its leading <span> are styled by ui.css with no
 * class names. Options are plain <option> elements, so values are always
 * strings — convert on change if you need numbers.
 */
export default function Select({ label, children, ...rest }: Props) {
    if (label === undefined) {
        return <select {...rest}>{children}</select>
    }
    return (
        <label>
            <span>{label}</span>
            <select {...rest}>{children}</select>
        </label>
    )
}
