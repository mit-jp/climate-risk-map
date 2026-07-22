import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tab, useCreateTabMutation } from '../MapApi'
import css from '../Navigation.module.css'
import { isDrafts } from './Editor'

function EditorNavigation({
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
    const [createTab] = useCreateTabMutation()
    const params = useParams()
    const urlTab = Number(params.tabId)
    const [newTabName, setNewTabName] = useState('')
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
        <nav ref={nav}>
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
            <form
                onSubmit={(e) => {
                    createTab({ name: newTabName, normalized: false })
                    setNewTabName('')
                    e.preventDefault()
                }}
            >
                <input
                    type="text"
                    className={css.newTab}
                    placeholder="New Tab"
                    onChange={(e) => setNewTabName(e.target.value)}
                    value={newTabName}
                />

                <button type="submit" disabled={newTabName.length === 0}>
                    create
                </button>
            </form>
        </nav>
    )
}

export default EditorNavigation
