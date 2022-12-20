import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import classNames from 'classnames'
import { DataTab } from './appSlice'
import css from './Navigation.module.css'

function Navigation({
    tabs,
    onTabClick,
    selectedTabId,
    root = '/',
}: {
    tabs: DataTab[]
    onTabClick: (tab: DataTab) => void
    selectedTabId?: number
    root?: string
}) {
    const params = useParams()
    const urlTab = Number(params.tabId)

    useEffect(() => {
        const tab = tabs.find((t) => t.id === urlTab)
        if (tab) {
            onTabClick(tab)
        }
    }, [urlTab, tabs, onTabClick])

    return (
        <nav className={css.nav}>
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    className={classNames({
                        [css.selected]: selectedTabId === tab.id,
                        [css.uncategorized]: tab.id === -1,
                    })}
                    to={root + tab.id}
                >
                    {tab.name}
                </Link>
            ))}
        </nav>
    )
}

export default Navigation
