import { useState } from 'react'
import { Button } from '@mui/material'
import css from './DataDescription.module.css'

function DataDescription({ name, description }: { name: string; description: string }) {
    const [show, setShow] = useState(false)

    return (
        <div className={css.dataDescription}>
            <Button
                variant={show ? 'contained' : 'outlined'}
                onClick={() => setShow(!show)}
                className={show ? css.shown : undefined}
            >
                {show ? `Hide ${name} data info` : `About the ${name} data`}
            </Button>
            {show && <p>{description}</p>}
        </div>
    )
}

export default DataDescription
