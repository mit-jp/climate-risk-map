import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTourActive } from '../appSlice'
import { RootState } from '../store'
import TourControls from './TourControls'
import TOUR_TARGET from './tourTargets'
import { TourStep, TourStepData } from './TourStep'

function TourPlanner() {
    const [currentStepNum, setCurrentStepNum] = useState(0)
    const dispatch = useDispatch()
    const isTourActive = useSelector((state: RootState) => state.app.isTourActive)
    const zoomTo = useSelector((rootState: RootState) => rootState.app.zoomTo)

    const TOUR_STEPS: TourStepData[] = [
        {
            name: 'Welcome to the STRESS Platform!',
            description:
                'Welcome to the System for the Triage of Risks from Environmental and Socioeconomic Stressors (STRESS) platform, a screening platform to identify overlapping environmental and socio-economic stressors at the county level across the U.S. Click through to learn how to use the platform.',
            targetElement: `#${TOUR_TARGET.map}`,
        },
        {
            name: 'The Relative Risk Tool',
            description:
                'For each metric in the ‘combinatory metrics’ tab, each county is given a relative risk score from. 0-100 based on how that county’s raw value for a metric, such as temperature, compares to all other counties across the country or state, depending on the view. This is a percentile ranking. Note that 100 does not mean an absolutely high risk and blue does not mean no risk, red and blue just refer to relatively high and low risk respectively.',
            // the legend lives inside the map SVG, which CSS anchors can't
            // target, so this step shows a centered popup with no highlight
        },
        {
            name: 'The sidebar can be used to select and combine metrics shown on the map',
            description:
                'You can select various metrics and weigh them. The resulting combinatory risk scores are a weighted average of the relative risk scores for each metric for each county.',
            targetElement: `#${TOUR_TARGET.dataSelector}`,
        },
        {
            name: 'Viewing County Data',
            description: `Mouse over a county to see its relative risk score based on the metrics selected. The default view uses percentile rankings that compare a county to all other counties across the country. `,

            targetElement: `#${TOUR_TARGET.map}`,
        },
        {
            name: 'Zooming into a State',
            description: `Click on a county to zoom in to its state.`,

            targetElement: `#${TOUR_TARGET.map}`,
            end: () => zoomTo !== undefined,
        },
        {
            name: 'Zooming into a State',
            description: `Now that you have zoomed in, the county’s relative risk for each metric is recalculated by comparing it only to other counties within the state. When this is done, the county’s relative risk score for individual and combinatory metrics will change.`,

            targetElement: `#${TOUR_TARGET.map}`,
            end: () => zoomTo !== undefined,
        },
        {
            name: 'County Report Cards',
            description:
                'When you have one county selected, click here to view the ‘report card’ for that county. This provides the raw value for each metric, the percentile ranking within the state, and the percentile ranking within the country.',
            targetElement: `#${TOUR_TARGET.reportCard}`,
        },
        {
            name: 'Adding Infrastructure',
            description:
                'Open the map layers menu and check the boxes to overlay different types of infrastructure across the country.',
            targetElement: `#${TOUR_TARGET.overlays}`,
        },
        {
            name: 'Downloading Data',
            description:
                'Click here to download the data and map images for the currently selected metrics.',
            targetElement: `#${TOUR_TARGET.downloads}`,
        },
        {
            name: 'Source Information',
            description: 'Click here to learn more about each metric and its datasource.',
            targetElement: `#${TOUR_TARGET.dataDescription}`,
        },
        {
            name: 'Viewing Raw Data',
            description:
                'The home tab includes ‘combinatory metrics,’ which provides and allows user combination of relative risk scores for over a dozen metrics. Click on other tabs to see data in its native units for over 100 metrics.',
            targetElement: `#${TOUR_TARGET.navigation}`,
        },
        {
            name: 'World View',
            description:
                'Click here to switch between viewing global and USA wide data. The global viewer currently does not include functionality for combinatory metrics but does include global climate projection data.',
            targetElement: `#${TOUR_TARGET.regionSelector}`,
        },
        {
            name: 'Important Notice',
            description:
                'Note that this tool is intended as a screening tool to identify areas for further investigation. The data included in this tool is certainly non-exhaustive of all important socio-economic and environmental risks. It is continually being expanded and updated, but is limited by data availability at the county-level across the U.S. ',
            targetElement: 'a',
        },
        {
            name: 'Revisiting the Tour',
            description:
                'You can view the tour again by clicking on this button at the bottom of the page.',
            targetElement: `#${TOUR_TARGET.viewTourButton}`,
        },
    ]

    const currentStep = TOUR_STEPS[currentStepNum]
    const canProceed = () => currentStep.end?.() ?? true

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenClimateTour')
        if (!hasSeenTour) {
            dispatch(setTourActive(true))
        }
    }, [dispatch])

    const finishTour = () => {
        dispatch(setTourActive(false))
        localStorage.setItem('hasSeenClimateTour', 'true')
        setCurrentStepNum(0)
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

    useEffect(() => {
        if (isTourActive && currentStep.targetElement) {
            const element = document.querySelector(currentStep.targetElement)
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                })
            }
        }
    }, [currentStepNum, isTourActive, currentStep.targetElement])

    if (!isTourActive) {
        return null
    }

    return (
        <TourStep stepData={TOUR_STEPS[currentStepNum]}>
            <TourControls
                currentStep={currentStepNum + 1}
                totalSteps={TOUR_STEPS.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                canProceed={canProceed}
            />
        </TourStep>
    )
}

export default TourPlanner
