import { CircularProgress } from '@mui/material'
import css from './Loading.module.css'

export default function Loading() {
    return (
        <div className={css.loadingContainer}>
            <CircularProgress />
            <p>Loading data...</p>
        </div>
    )
}
