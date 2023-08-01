import { Key } from 'react'
import css from './DataSelector.module.css'

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
                        className={css.input}
                        id={id(item).toString()}
                        checked={selectedId === id(item)}
                        type="radio"
                        value={id(item)}
                        onChange={() => onClick(item)}
                        name="dataGroup"
                    />
                    <label className={css.label} htmlFor={id(item).toString()}>
                        {label(item)}
                    </label>
                </div>
            ))}
        </form>
    )
}
export function EmptySelectorList() {
    return <div id={css.dataSelector} />
}

export default SelectorList
