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
    const classes = ['ui-field', fullWidth ? 'ui-full-width' : '', className]
        .filter(Boolean)
        .join(' ')
    const shared = { value, onChange, onBlur, required, disabled, maxLength, placeholder, id }
    return (
        <label className={classes} style={style}>
            <span className="ui-field-label">{label}</span>
            {multiline ? (
                <textarea className="ui-input" rows={4} {...shared} />
            ) : (
                <input className="ui-input" type={type} {...shared} />
            )}
        </label>
    )
}
