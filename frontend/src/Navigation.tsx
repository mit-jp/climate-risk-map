import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTab from './DataTab'
import { setDataTab } from './appSlice'
import css from './Navigation.module.css'

import { TabIdToTab, TabToId } from './MapVisualization'
import { RootState } from './store'

const dataTabs = Object.values(DataTab)

function Navigation() {
    const dispatch = useDispatch()
    const selectedDataTab = useSelector((state: RootState) => state.app.dataTab)
    const params = useParams()
    const { tabId } = params

    useEffect(() => {
        const tab = TabIdToTab[Number(tabId)]
        if (tab) {
            dispatch(setDataTab(tab))
        }
    }, [tabId, dispatch])

    return (
        <nav className={css.nav}>
            {dataTabs.map((dataTab) => (
                <Link
                    key={dataTab}
                    className={selectedDataTab === dataTab ? css.selected : undefined}
                    to={`/${TabToId[dataTab]}`}
                >
                    {dataTab}
                </Link>
            ))}
        </nav>
    )
}

export default Navigation
