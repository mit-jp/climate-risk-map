import React, { ChangeEvent } from 'react';

type Props = {
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void,
    showNormalized: boolean
};

const NormalizeSelector = ({onSelectionChange, showNormalized}: Props) =>
    <form>
        <div>
            <input type="radio" id="raw" name="data-type" value="raw" checked={!showNormalized} onChange={onSelectionChange} />
            <label htmlFor="raw">Raw Data</label>
        </div>

        <div>
            <input type="radio" id="normalized" name="data-type" value="normalized"  checked={showNormalized} onChange={onSelectionChange} />
            <label htmlFor="normalized">Normalized Data</label>
        </div>
    </form>

export default NormalizeSelector;