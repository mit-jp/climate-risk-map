import { useState, useEffect } from 'react'
import { TourStep, TourStepData } from './TourStep'
import TourControls from './TourControls'

const TOUR_STEPS: TourStepData[] = [
    {
        name: 'Welcome to the STRESS Platform!',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit nesciunt molestias odio, temporibus enim animi voluptatum excepturi nisi non asperiores hic maxime pariatur qui amet cumque quam vel officiis assumenda.',
        targetElement: '#map-svg',
        popupPosition: {
            top: '20%',
            left: '50%',
            width: '600px',
            height: '200px',
        },
    },
    {
        name: 'Use the navigation bar to select a metric',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero alias dolores at? Repellendus, nostrum dolore delectus doloremque inventore ipsum quod natus non, illum vero illo quaerat labore vel beatae saepe?',
        targetElement: '#navdiv',
        popupPosition: {
            top: '30%',
            left: '50%',
            width: '600px',
            height: '200px',
        },
    },
    {
        name: 'The sidebar can be used to select and combine metrics shown on the map',
        description:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus velit fugit itaque, adipisci cupiditate eligendi cum ullam! Soluta aut culpa quisquam veniam, quaerat, facere, maxime sed dolores delectus exercitationem iure?',
        targetElement: '#data-selector',
        popupPosition: {
            top: '33.5%',
            left: '40%',
            width: '700px',
            height: '300px',
        },
    },
]

function TourPlanner() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenClimateTour')
        if (!hasSeenTour) {
            setIsActive(true)
        }
    }, [])

    const finishTour = () => {
        setIsActive(false)
        localStorage.setItem('hasSeenClimateTour', 'true')
    }

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            finishTour()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSkip = () => {
        finishTour()
    }

    if (!isActive) {
        return null
    }

    return (
        <>
            <TourStep stepData={TOUR_STEPS[currentStep]} />
            <TourControls
                currentStep={currentStep + 1}
                totalSteps={TOUR_STEPS.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
            />
        </>
    )
}

export default TourPlanner
