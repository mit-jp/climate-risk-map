import { CSSProperties } from 'react'

export default function Spinner({ size, style }: { size?: number; style?: CSSProperties }) {
    const sizeStyle = size ? { width: size, height: size } : undefined
    return <span className="ui-spinner" role="progressbar" style={{ ...sizeStyle, ...style }} />
}
