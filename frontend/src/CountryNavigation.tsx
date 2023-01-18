import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Region, selectRegion } from './appSlice'
import css from './Navigation.module.css'
import { RootState } from './store'

export default function CountryNavigation() {
    const region = useSelector((state: RootState) => state.app.region)
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
                    checked={region === 'USA'}
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
                    checked={region === 'World'}
                    onChange={onChange}
                />
                World
            </label>
        </nav>
    )
}
