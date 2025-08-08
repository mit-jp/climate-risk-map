import TourHighlight from './TourHighlight'
import TourPopup from './TourPopup'

// The data structure for each step
export type TourStepData = {
    name: string
    description: string
    image?: string
    targetElement: string // CSS selector
    buttonText?: string

    popupPosition?: {
        top?: string
        left?: string
        width?: string
        height?: string
    }
}

// The way that the steps should be given (an object)
type TourStepProps = {
    stepData: TourStepData
}

export function TourStep({ stepData }: TourStepProps) {
    return (
        <>
            <TourHighlight targetElement={stepData.targetElement} />

            <TourPopup
                name={stepData.name}
                description={stepData.description}
                image={stepData.image}
                position={stepData.popupPosition}
            />
        </>
    )
}
