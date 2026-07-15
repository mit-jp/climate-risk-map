import { CSSProperties, ReactNode, SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
    labelClassName?: string
    labelStyle?: CSSProperties
    children: ReactNode
}

/**
 * A native <select> with an optional stacked label. Options are plain
 * <option> elements, so values are always strings — convert on change if
 * you need numbers.
 */
export default function Select({
    label,
    labelClassName,
    labelStyle,
    className,
    children,
    ...rest
}: Props) {
    const selectClasses = ['ui-select', className].filter(Boolean).join(' ')
    if (label === undefined) {
        return (
            <select className={selectClasses} {...rest}>
                {children}
            </select>
        )
    }
    const labelClasses = ['ui-field-label', labelClassName].filter(Boolean).join(' ')
    return (
        <label className="ui-field">
            <span className={labelClasses} style={labelStyle}>
                {label}
            </span>
            <select className={selectClasses} {...rest}>
                {children}
            </select>
        </label>
    )
}
