import { ChangeEvent, CSSProperties, FocusEvent } from 'react'

type Props = {
    label: string
    value: string | number
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    multiline?: boolean
    fullWidth?: boolean
    type?: string
    required?: boolean
    disabled?: boolean
    maxLength?: number
    placeholder?: string
    id?: string
    className?: string
    style?: CSSProperties
}

/** A stacked label + input/textarea, styled by ui.css with no class names */
export default function TextField({
    label,
    value,
    onChange,
    onBlur,
    multiline = false,
    fullWidth = false,
    type = 'text',
    required,
    disabled,
    maxLength,
    placeholder,
    id,
    className,
    style,
}: Props) {
    const classes =
        [fullWidth ? 'ui-full-width' : '', className].filter(Boolean).join(' ') || undefined
    const shared = { value, onChange, onBlur, required, disabled, maxLength, placeholder, id }
    return (
        <label className={classes} style={style}>
            <span>{label}</span>
            {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
        </label>
    )
}
