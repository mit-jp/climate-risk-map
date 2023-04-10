import classNames from 'classnames'
import { useEffect, useState } from 'react'
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

                <button type="submit" className={css.createTab} disabled={newTabName.length === 0}>
                    create
                </button>
            </form>
        </nav>
    )
}

export default EditorNavigation
