import { CSSProperties } from 'react'

/** An indeterminate spinner; the styling keys off role="progressbar" */
export default function Spinner({ size, style }: { size?: number; style?: CSSProperties }) {
    const sizeStyle = size ? { width: size, height: size } : undefined
    return <span role="progressbar" style={{ ...sizeStyle, ...style }} />
}
