import { useDispatch, useSelector } from 'react-redux'
import ReactDOM from 'react-dom'
import { RootState } from '../store'
import { setTourActive } from '../appSlice'
import css from './tour.module.css'

function ViewTourButton() {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(setTourActive(true))
    }

    const isTourActive = useSelector((state: RootState) => state.app.isTourActive)

    if (isTourActive) {
        return null
    }

    return ReactDOM.createPortal(
        <button
            type="button"
            onClick={handleClick}
            className={css.viewTourButton}
            id="view-tour-button-id"
        >
            View Tour
        </button>,
        document.body
    )
}

export default ViewTourButton
