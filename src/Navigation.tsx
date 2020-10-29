import React, { MouseEvent } from 'react';
import dataDefinitions, { DataType } from './DataDefinitions';

type Props = {
    selection: DataType,
    onDataTypeChanged: (event: MouseEvent<HTMLLIElement>) => void
}

const dataTypes = [DataType.Raw, DataType.Normalized];

const listDataTypes = ({selection, onDataTypeChanged}: Props) =>
    dataTypes.map(item => <li className={selection === item ? "selected" : undefined} onClick={onDataTypeChanged}>{item}</li>)

const Navigation = (props: Props) =>
    <nav>
        <ul>
            {listDataTypes(props)}
        </ul>
    </nav>

export default Navigation;