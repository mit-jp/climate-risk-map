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
                        <button type="button" className={css.controlButton} onClick={onPrevious}>
                            Previous
                        </button>
                    )}
                    <button type="button" className={css.controlButton} onClick={onNext}>
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                    <button type="button" className={css.controlButton} onClick={onSkip}>
                        Skip Tour
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TourControls
