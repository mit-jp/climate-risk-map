import classNames from 'classnames'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tab } from './MapApi'
import css from './Navigation.module.css'
import { isDrafts } from './editor/Editor'

function Navigation({
    tabs,
    onTabClick,
    selectedTabId,
    root = '/',
}: {
    tabs: Tab[]
    onTabClick: (tab: Tab) => void
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
                        [css.uncategorized]: isDrafts(tab),
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
