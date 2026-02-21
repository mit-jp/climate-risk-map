import css from './DataSelector.module.css'
import Loading from './LoadingScreen'

export default function EmptyDataSelector() {
    return (
        <div id={css.dataSelector}>
            <Loading />
        </div>
    )
}
