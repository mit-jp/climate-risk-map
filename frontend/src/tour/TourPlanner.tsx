import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { TourStep, TourStepData } from './TourStep'
import TourControls from './TourControls'
import css from './tour.module.css'
import { RootState } from '../store'

function TourPlanner() {
    const [currentStepNum, setCurrentStepNum] = useState(0)
    const [isActive, setIsActive] = useState(false)

    const zoomTo = useSelector((rootState: RootState) => rootState.app.zoomTo)

    const TOUR_STEPS: TourStepData[] = [
        {
            name: 'Welcome to the STRESS Platform!',
            description:
                'Welcome to the System for the Triage of Risks from Environmental and Socioeconomic Stressors (STRESS) platform, a screening platform to identify overlapping environmental and socio-economic stressors at the county level across the U.S. Click through to learn how to use the platform.',
            targetElement: '#map-svg',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'The Relative Risk Tool',
            description:
                'For each metric in the ‘combinatory metrics’ tab, each county is given a relative risk score from. 0-100 based on how that county’s raw value for a metric, such as temperature, compares to all other counties across the country or state, depending on the view. This is a percentile ranking. Note that 100 does not mean an absolutely high risk and blue does not mean no risk, red and blue just refer to relatively high and low risk respectively.',
            targetElement: '#map-legend',
            popupPosition: {
                top: '20%',
                left: '55%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'The sidebar can be used to select and combine metrics shown on the map',
            description:
                'You can select various metrics and weigh them. The resulting combinatory risk scores are a weighted average of the relative risk scores for each metric for each county.',
            targetElement: '#data-selector',
            popupPosition: {
                top: '33.5%',
                left: '40%',
                width: '700px',
                height: '300px',
            },
        },
        {
            name: 'Viewing County Data',
            description: `Mouse over a county to see its relative risk score based on the metrics selected. The default view uses percentile rankings that compare a county to all other counties across the country. Click on a county to zoom in to the state. `,

            targetElement: '#map-svg',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
            end: () => zoomTo !== undefined,
        },
        {
            name: 'Viewing County Data',
            description: `Now that you have zoomed in, the county’s relative risk for each metric is recalculated by comparing it only to other counties within the state. When this is done, the county’s relative risk score for individual and combinatory metrics will change.`,

            targetElement: '#map-svg',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
            end: () => zoomTo !== undefined,
        },
        {
            name: 'County Report Cards',
            description:
                'When you have one county selected, click here to view the ‘report card’ for that county. This provides the raw value for each metric, the percentile ranking within the state, and the percentile ranking within the country.',
            targetElement: '#report-card-controls',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'Adding Infrastructure',
            description:
                'Click on these boxes to add in different types of infrastructure across the country.',
            targetElement: '#map-overlays',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'Source Information',
            description:
                'Click here to learn more about each metric and its datasource. <br> NEED TO PULL MAIN!',
            targetElement: '#map-svg',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'Downloading Data',
            description:
                'Click here to download the data and map images for the currently selected metrics.',
            targetElement: '#download-buttons',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'Viewing Raw Data',
            description:
                'The home tab includes ‘combinatory metrics,’ which provides and allows user combination of relative risk scores for over a dozen metrics. Click on other tabs to see data in its native units for over 100 metrics.',
            targetElement: '#navdiv',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'World View',
            description:
                'Click here to switch between viewing global and USA wide data. The global viewer currently does not include functionality for combinatory metrics but does include global climate projection data.',
            targetElement: '#region-selector',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
        {
            name: 'Important Notice',
            description:
                'Note that this tool is intended as a screening tool to identify areas for further investigation. The data included in this tool is certainly non-exhaustive of all important socio-economic and environmental risks. It is continually being expanded and updated, but is limited by data availability at the county-level across the U.S. ',
            targetElement: '#report-card-controls',
            popupPosition: {
                top: '20%',
                left: '50%',
                width: '600px',
                height: '200px',
            },
        },
    ]

    const currentStep = TOUR_STEPS[currentStepNum]
    const canProceed = () => currentStep.end?.() ?? true

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenClimateTour')
        if (!hasSeenTour) {
            setIsActive(true)
        }
    }, [])

    const restartTour = () => {
        setIsActive(true)
        localStorage.setItem('hasSeenClimateTour', 'false')
        setCurrentStepNum(0)
    }

    const finishTour = () => {
        setIsActive(false)
        localStorage.setItem('hasSeenClimateTour', 'true')
    }

    const handleNext = () => {
        if (currentStepNum < TOUR_STEPS.length - 1) {
            setCurrentStepNum(currentStepNum + 1)
        } else {
            finishTour()
        }
    }

    const handlePrevious = () => {
        if (currentStepNum > 0) {
            setCurrentStepNum(currentStepNum - 1)
        }
    }

    const handleSkip = () => {
        finishTour()
    }

    if (!isActive) {
        return (
            <Button id={css.viewTourButton} onClick={restartTour}>
                View Tour
            </Button>
        )
    }

    return (
        <>
            <TourStep stepData={TOUR_STEPS[currentStepNum]} />
            <TourControls
                currentStep={currentStepNum + 1}
                totalSteps={TOUR_STEPS.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                canProceed={canProceed}
            />
        </>
    )
}

export default TourPlanner
