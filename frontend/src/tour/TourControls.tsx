import { Button } from '@mui/material'
import css from './tour.module.css'

type TourControlsProps = {
    currentStep: number
    totalSteps: number
    onNext: () => void
    onPrevious: () => void
    onSkip: () => void
}

function TourControls({ currentStep, totalSteps, onNext, onPrevious, onSkip }: TourControlsProps) {
    const isFirstStep = currentStep === 1
    const isLastStep = currentStep === totalSteps

    return (
        <div className={css.tourControls}>
            <div className={css.controlsContent}>
                <span className={css.progressText}>
                    Step {currentStep} of {totalSteps}
                </span>

                <div className={css.buttonGroup}>
                    {!isFirstStep && (
                        <Button className={css.controlButton} onClick={onPrevious}>
                            Previous
                        </Button>
                    )}
                    <Button className={css.primaryButton} onClick={onNext}>
                        {isLastStep ? 'Finish' : 'Next'}
                    </Button>
                    <Button className={css.controlButton} onClick={onSkip}>
                        Skip Tour
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TourControls
