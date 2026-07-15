import { Spinner } from './ui'
import css from './DataSelector.module.css'

export default function EmptyDataSelector() {
    return (
        <div
            id={css.dataSelector}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                color: '#888',
                padding: '2rem',
            }}
        >
            <Spinner size={30} style={{ color: '#888' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading options...</p>
        </div>
    )
}
