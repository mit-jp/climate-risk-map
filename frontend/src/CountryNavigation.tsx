import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Region, selectRegion } from './appSlice'
import css from './Navigation.module.css'
import { RootState } from './store'

export default function CountryNavigation() {
    const selectedRegion = useSelector((state: RootState) => state.app.selectedRegion)
    const dispatch = useDispatch()
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(selectRegion(event.target.value as Region))
    }

    return (
        <nav className={css.nav}>
            <label htmlFor="usa">
                <input
                    type="radio"
                    name="geography-type"
                    id="USA"
                    value="USA"
                    checked={selectedRegion === 'USA'}
                    onChange={onChange}
                />
                USA
            </label>
            <label htmlFor="world">
                <input
                    type="radio"
                    name="geography-type"
                    id="World"
                    value="World"
                    checked={selectedRegion === 'World'}
                    onChange={onChange}
                />
                World
            </label>
        </nav>
    )
}