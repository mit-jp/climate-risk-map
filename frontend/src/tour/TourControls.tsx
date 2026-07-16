import { Button } from '../ui'
import css from './tour.module.css'

type TourControlsProps = {
    currentStep: number
    totalSteps: number
    onNext: () => void
    onPrevious: () => void
    onSkip: () => void
    canProceed: () => boolean
}

function TourControls({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    canProceed,
}: TourControlsProps) {
    const isFirstStep = currentStep === 1
    const isLastStep = currentStep === totalSteps

    return (
        <div className={css.tourControls}>
            <span className={css.progressText}>
                Step {currentStep} of {totalSteps}
            </span>

            <div className={css.buttonGroup}>
                {!isFirstStep && (
                    <Button variant="outlined" onClick={onPrevious}>
                        Previous
                    </Button>
                )}
                <Button variant="contained" onClick={onNext} disabled={!canProceed()}>
                    {isLastStep ? 'Finish' : 'Next'}
                </Button>
                <Button variant="outlined" onClick={onSkip}>
                    Skip Tour
                </Button>
            </div>
        </div>
    )
}

export default TourControls
