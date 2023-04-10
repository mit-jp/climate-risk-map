import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import css from './Navigation.module.css'
import { Region, selectRegion } from './appSlice'
import { RootState } from './store'

export default function RegionNavigation() {
    const params = useParams()
    const urlRegion = Number(params.region)
    const region = useSelector((state: RootState) => state.app.region)
    const dispatch = useDispatch()
    useEffect(() => {
        if (urlRegion == null || urlRegion === 1) {
            dispatch(selectRegion('USA'))
        } else if (urlRegion === 2) {
            dispatch(selectRegion('World'))
        }
    }, [dispatch, urlRegion])

    const onChange = (region: Region) => {
        dispatch(selectRegion(region))
    }

    return (
        <nav className={css.regionNav}>
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
