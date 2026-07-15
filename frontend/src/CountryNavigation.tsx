import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isGeographyType } from './MapVisualization'
import css from './Navigation.module.css'
import { Region, REGION_FOR, selectRegion } from './appSlice'
import { RootState } from './store'
import { Select } from './ui'

export default function RegionNavigation() {
    const params = useParams()
    const urlRegion = Number(params.region)
    const region = useSelector((state: RootState) => state.app.region)
    const dispatch = useDispatch()
    useEffect(() => {
        const regionToSelect = isGeographyType(urlRegion) ? REGION_FOR[urlRegion] : 'USA'
        dispatch(selectRegion(regionToSelect))
    }, [dispatch, urlRegion])

    const onChange = (region: Region) => {
        dispatch(selectRegion(region))
    }

    return (
        <nav className={css.regionNav} id="region-selector">
            <Select
                label="Region"
                labelStyle={{ color: '#000', fontWeight: 'bold' }}
                value={region}
                onChange={(event) => {
                    if (region != null) {
                        onChange(event.target.value as Region)
                    }
                }}
                aria-label="geography type"
                style={{ backgroundColor: '#d9dee4', color: 'black', fontWeight: 'bold' }}
            >
                <option value="World" aria-label="world">
                    World
                </option>
                <option value="USA" aria-label="usa">
                    USA
                </option>
                <option value="EssexMassachusetts" aria-label="essex county, massachusetts">
                    Essex County, Massachusetts
                </option>
            </Select>
        </nav>
    )
}
