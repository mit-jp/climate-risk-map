import { Combobox } from '../ui'

export default function EmptyDatasetSelector() {
    return (
        <Combobox
            disabled
            label="Dataset"
            options={[]}
            value={null}
            onChange={() => {}}
            getLabel={() => ''}
        />
    )
}
