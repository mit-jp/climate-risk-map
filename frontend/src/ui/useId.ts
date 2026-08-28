import { useRef } from 'react'

let counter = 0

/**
 * A stable, document-unique id for the lifetime of a component instance.
 * React 17 predates the built-in useId; replace with React's when we
 * upgrade.
 */
export default function useId(prefix = 'uid'): string {
    const id = useRef<string>()
    if (id.current === undefined) {
        counter += 1
        id.current = `${prefix}-${counter}`
    }
    return id.current
}
