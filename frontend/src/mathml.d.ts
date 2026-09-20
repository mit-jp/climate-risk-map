import React from 'react'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            math: React.HTMLAttributes<Element> & {
                xmlns?: string
                display?: 'block' | 'inline'
            }
            mrow: React.HTMLAttributes<Element>
            msub: React.HTMLAttributes<Element>
            mi: React.HTMLAttributes<Element>
            mo: React.HTMLAttributes<Element>
            mn: React.HTMLAttributes<Element>
            mfrac: React.HTMLAttributes<Element>
        }
    }
}

export {}
