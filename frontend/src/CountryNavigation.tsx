import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Region, selectRegion } from './appSlice'
import css from './Navigation.module.css'
import { RootState } from './store'

export default function CountryNavigation() {
    const region = useSelector((state: RootState) => state.app.region)
    const dispatch = useDispatch()
    const onChange = (region: Region) => {
        dispatch(selectRegion(region))
    }

    return (
        <nav className={css.nav}>
            <ToggleButtonGroup
                value={region}
                exclusive
                onChange={(_, region: Region) => {
                    if (region != null) {
                        onChange(region)
                    }
                }}
                aria-label="geography type"
            >
                <ToggleButton value="World" aria-label="world">
                    World
                </ToggleButton>
                <ToggleButton value="USA" aria-label="usa">
                    USA
                </ToggleButton>
            </ToggleButtonGroup>
        </nav>
    )
}
