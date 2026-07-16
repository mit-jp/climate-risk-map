import { ReactNode } from 'react'
import TourHighlight from './TourHighlight'
import TourPopup from './TourPopup'

// The data structure for each step
export type TourStepData = {
    name: string
    description: string
    image?: string
    targetElement: string // CSS selector
    buttonText?: string

    end?: () => boolean
}

// The way that the steps should be given (an object)
type TourStepProps = {
    stepData: TourStepData
    children?: ReactNode
}

export function TourStep({ stepData, children }: TourStepProps) {
    return (
        <>
            <TourHighlight targetElement={stepData.targetElement} />

            <TourPopup
                name={stepData.name}
                description={stepData.description}
                image={stepData.image}
                targetElement={stepData.targetElement}
            >
                {children}
            </TourPopup>
        </>
    )
}
