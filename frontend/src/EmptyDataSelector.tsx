import { Spinner } from './ui'
import css from './DataSelector.module.css'

export default function EmptyDataSelector() {
    return (
        <div id={css.dataSelector} className={css.loading}>
            <Spinner size={30} />
            <p>Loading options...</p>
        </div>
    )
}
