import { useState } from 'react'
import css from './DataDescription.module.css'

function DataDescription({ name, description }: { name: string; description: string }) {
    const [show, setShow] = useState(false)

    return (
        <div className={css.dataDescription}>
            <button
                type="button"
                onClick={() => setShow(!show)}
                className={show ? css.shown : undefined}
            >
                About the {name} data
            </button>
            {show && <p>{description}</p>}
        </div>
    )
}

export default DataDescription
