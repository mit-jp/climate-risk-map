import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material'
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
            <FormControl>
                <InputLabel
                    id="region-label"
                    disableAnimation
                    style={{ color: '#000', fontWeight: 'bold' }}
                >
                    Region
                </InputLabel>
                <Select
                    label="Region"
                    size="small"
                    value={region}
                    onChange={(event: SelectChangeEvent) => {
                        if (region != null) {
                            onChange(event.target.value as Region)
                        }
                    }}
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    aria-label="geography type"
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                    }}
                    style={{ backgroundColor: '#d9dee4' }}
                    autoWidth
                >
                    <MenuItem value="World" aria-label="world">
                        World
                    </MenuItem>
                    <MenuItem value="USA" aria-label="usa">
                        USA
                    </MenuItem>
                </Select>
            </FormControl>
        </nav>
    )
}
