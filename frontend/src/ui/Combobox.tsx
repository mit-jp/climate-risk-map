import { CSSProperties, KeyboardEvent, useState } from 'react'

const MAX_VISIBLE_OPTIONS = 50

type Props<T> = {
    label: string
    options: T[]
    value: T | null
    onChange: (value: T) => void
    getLabel: (option: T) => string
    disabled?: boolean
    id?: string
    style?: CSSProperties
}

/**
 * An autocomplete: a text input that filters a dropdown of options.
 * Typing filters by substring; blur reverts to the current value.
 */
export default function Combobox<T>({
    label,
    options,
    value,
    onChange,
    getLabel,
    disabled,
    id,
    style,
}: Props<T>) {
    // null query means "not editing": the input shows the selected value
    const [query, setQuery] = useState<string | null>(null)
    const [highlighted, setHighlighted] = useState(0)
    const open = query !== null

    const matches =
        query === null
            ? []
            : options
                  .filter((option) => getLabel(option).toLowerCase().includes(query.toLowerCase()))
                  .slice(0, MAX_VISIBLE_OPTIONS)

    const select = (option: T) => {
        onChange(option)
        setQuery(null)
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (!open) {
            return
        }
        if (event.key === 'ArrowDown') {
            setHighlighted(Math.min(highlighted + 1, matches.length - 1))
            event.preventDefault()
        } else if (event.key === 'ArrowUp') {
            setHighlighted(Math.max(highlighted - 1, 0))
            event.preventDefault()
        } else if (event.key === 'Enter') {
            if (matches[highlighted]) {
                select(matches[highlighted])
            }
            event.preventDefault()
        } else if (event.key === 'Escape') {
            setQuery(null)
        }
    }

    return (
        <div className="ui-combobox" style={style}>
            <label className="ui-field">
                <span className="ui-field-label">{label}</span>
                <input
                    className="ui-input"
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={id}
                    disabled={disabled}
                    value={query ?? (value ? getLabel(value) : '')}
                    placeholder={label}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setHighlighted(0)
                    }}
                    onFocus={() => setQuery('')}
                    onBlur={() => setQuery(null)}
                    onKeyDown={onKeyDown}
                />
            </label>
            {open && matches.length > 0 && (
                <ul className="ui-combobox-list" id={id} role="listbox">
                    {matches.map((option, index) => (
                        <li
                            key={getLabel(option)}
                            role="option"
                            aria-selected={option === value}
                            className={index === highlighted ? 'ui-active' : undefined}
                            // mousedown fires before the input's blur
                            onMouseDown={() => select(option)}
                        >
                            {getLabel(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
