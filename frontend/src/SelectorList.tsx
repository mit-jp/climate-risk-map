import { Key } from 'react'
import { Link } from 'react-router-dom'
import css from './DataSelector.module.css'
import { useDeleteTabMutation } from './MapApi'

function SelectorList<Item, Id extends Key>({
    items,
    selectedId,
    onClick,
    id,
    label,
}: {
    items: Item[]
    selectedId: Id | undefined
    onClick: (item: Item) => void
    id: (item: Item) => Id
    label: (item: Item) => string
}) {
    return (
        <form id={css.dataSelector}>
            {items.map((item) => (
                <div key={id(item)}>
                    <input
                        className={css.dataGroup}
                        id={id(item).toString()}
                        checked={selectedId === id(item)}
                        type="radio"
                        value={id(item)}
                        onChange={() => onClick(item)}
                        name="dataGroup"
                    />
                    <label className={css.dataGroup} htmlFor={id(item).toString()}>
                        {label(item)}
                    </label>
                </div>
            ))}
        </form>
    )
}
export function SkeletonSelectorList() {
    return <div id={css.dataSelector} />
}

export function EmptyMapVisualizationList({ tabId }: { tabId: number }) {
    const [deleteTab] = useDeleteTabMutation()

    return (
        <div id={css.dataSelector}>
            <div className={css.actions}>
                <Link to="/editor/-1" className={css.publishLink}>
                    Publish a draft
                </Link>

                <button type="button" className={css.deleteTab} onClick={() => deleteTab(tabId)}>
                    delete this tab
                </button>
            </div>
        </div>
    )
}
export default SelectorList
