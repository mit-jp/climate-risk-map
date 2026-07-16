import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'error' | 'accent'
    loading?: boolean
}

/** A bare <button> is already styled; this adds variants and a loading state */
export default function Button({
    variant = 'text',
    color = 'primary',
    loading = false,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
}: Props) {
    const classes =
        [variant !== 'text' ? variant : '', color !== 'primary' ? color : '', className]
            .filter(Boolean)
            .join(' ') || undefined
    return (
        // eslint-disable-next-line react/button-has-type
        <button type={type} className={classes} disabled={disabled || loading} {...rest}>
            {loading && <Spinner />}
            {children}
        </button>
    )
}
