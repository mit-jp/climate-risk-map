import { Spinner } from './ui'
import css from './Loading.module.css'

export default function LoadingScreen() {
    return (
        <div className={css.loadingContainer}>
            <Spinner />
            <p>Loading data...</p>
        </div>
    )
}
