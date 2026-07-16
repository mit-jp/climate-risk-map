import { useDispatch } from 'react-redux'
import { Button } from '../ui'
import css from './tour.module.css'
import { setTourActive } from '../appSlice'
import TOUR_TARGET from './tourTargets'

function ViewTourButton() {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(setTourActive(true))
    }

    return (
        <Button
            variant="contained"
            onClick={handleClick}
            className={css.viewTourButton}
            id={TOUR_TARGET.viewTourButton}
        >
            View Tour
        </Button>
    )
}

export default ViewTourButton
