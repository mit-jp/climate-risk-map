import React, { MouseEvent } from 'react';
import { Map } from 'immutable';
import { DataType } from './DataDefinitions';

type Props = {
    selection: DataTab,
    onDataTabChanged: (event: MouseEvent<HTMLLIElement>) => void
}

export enum DataTab {
    RiskMetrics = "multi-system metrics",
    Water = "water",
    Land = "land",
    Climate = "climate",
    Economic = "economic",
    ClimateOpinions = "climate opinions",
    Demographics = "demographics",
}

export const TabToTypeMap = Map([
    [DataTab.Climate, DataType.Climate],
    [DataTab.Water, DataType.Water],
    [DataTab.Land, DataType.Land],
    [DataTab.Economic, DataType.Economic],
    [DataTab.Demographics, DataType.Demographics],
    [DataTab.ClimateOpinions, DataType.ClimateOpinions],
]);

const dataTabs = Object.values(DataTab);

const listDataTabs = ({selection, onDataTabChanged}: Props) =>
    dataTabs.map(dataTab =>
        <li className={selection === dataTab ? "selected" : undefined} onClick={onDataTabChanged} key={dataTab}>{dataTab}</li>
    )

const Navigation = (props: Props) =>
    <nav>
        <ul>
            {listDataTabs(props)}
        </ul>
    </nav>

export default Navigation;
