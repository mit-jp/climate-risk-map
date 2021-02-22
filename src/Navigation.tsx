import React, { MouseEvent } from 'react';
import { Map } from 'immutable';
import { DataType } from './DataDefinitions';

type Props = {
    selection: DataTab,
    onDataTabChanged: (event: MouseEvent<HTMLLIElement>) => void
}

export enum DataTab {
    RiskMetrics = "risk metrics",
    Climate = "climate",
    Economic = "economic",
    ClimateOpinions = "climate opinions",
    EnvironmentalJustice = "environmental justice",
}

export const TabToTypeMap = Map([
    [DataTab.Climate, DataType.Climate],
    [DataTab.Economic, DataType.Economic],
    [DataTab.EnvironmentalJustice, DataType.EnvironmentalJustice],
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
            <li key="download"><a href={process.env.PUBLIC_URL + "/?page=download"} target="_blank" rel="noopener noreferrer">Download</a></li>
        </ul>
    </nav>

export default Navigation;