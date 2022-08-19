import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import css from './Navigation.module.css'
import { RootState } from './store'

export default function CountryNavigation() {
    const dispatch = useDispatch()
    const selectedRegion = useSelector((state: RootState) => state.app.selectedRegion)
    const urlParams = useParams()

    return (
        <nav className={css.nav}>
            <Link to="/usa" className={selectedRegion === 'USA' ? css.selected : undefined}>
                USA
            </Link>
            <Link to="/world" className={selectedRegion === 'World' ? css.selected : undefined}>
                World
            </Link>
        </nav>
    )
}
