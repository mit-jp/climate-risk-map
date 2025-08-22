import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import css from './tour.module.css'
import { setTourActive } from '../appSlice'

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
            id="view-tour-button-id"
        >
            View Tour
        </Button>
    )
}

export default ViewTourButton
