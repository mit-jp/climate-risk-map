import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tab } from './MapApi'
import css from './Navigation.module.css'
import { isDrafts } from './editor/Editor'
import TOUR_TARGET from './tour/tourTargets'

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
    const nav = useRef<HTMLElement>(null)

    useEffect(() => {
        const tab = tabs.find((t) => t.id === urlTab)
        if (tab) {
            onTabClick(tab)
        }
    }, [urlTab, tabs, onTabClick])

    // keep the selected tab in view when the nav scrolls horizontally
    useEffect(() => {
        nav.current
            ?.querySelector('[aria-current]')
            ?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    }, [selectedTabId])

    return (
        <nav ref={nav} id={TOUR_TARGET.navigation}>
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    className={isDrafts(tab) ? css.uncategorized : undefined}
                    aria-current={selectedTabId === tab.id ? 'page' : undefined}
                    to={root + tab.id}
                >
                    {tab.name}
                </Link>
            ))}
        </nav>
    )
}

export default Navigation
