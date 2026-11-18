// The native Popover API attributes are missing from React 17's types.
// React passes lowercase unknown attributes through to the DOM, so these
// reach the browser as real HTML attributes.
export {}

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
        popover?: 'auto' | 'manual' | ''
        popovertarget?: string
        popovertargetaction?: 'toggle' | 'show' | 'hide'
    }
}
