import React, { MouseEvent } from 'react';
import { DataType } from './DataDefinitions';

type Props = {
    selection: DataType,
    onDataTypeChanged: (event: MouseEvent<HTMLLIElement>) => void
}

const dataTypes = Object.values(DataType);

const listDataTypes = ({selection, onDataTypeChanged}: Props) =>
    dataTypes.map(dataType =>
        <li className={selection === dataType ? "selected" : undefined} onClick={onDataTypeChanged} key={dataType}>{dataType}</li>
    )

const Navigation = (props: Props) =>
    <nav>
        <ul>
            {listDataTypes(props)}
        </ul>
    </nav>

export default Navigation;