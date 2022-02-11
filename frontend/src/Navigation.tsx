import { useSelector } from 'react-redux'
import { useThunkDispatch } from './Home'
import { RootState } from './store'
import DataTab from './DataTab'
import { setDataTab } from './appSlice'
import css from './Navigation.module.css'

const dataTabs = Object.values(DataTab)

function Navigation() {
    const dispatch = useThunkDispatch()
    const selectedDataTab = useSelector((state: RootState) => state.app.dataTab)

    return (
        <nav id={css.nav}>
            <ul>
                {dataTabs.map((dataTab) => (
                    <li key={dataTab}>
                        <button
                            type="button"
                            className={selectedDataTab === dataTab ? css.selected : undefined}
                            onClick={(event) =>
                                dispatch(setDataTab(event.currentTarget.textContent as DataTab))
                            }
                        >
                            {dataTab}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navigation
