import React from 'react';
import { Map } from 'immutable';
import { DataType } from './DataDefinitions';
import { useThunkDispatch } from './Home';
import { clickTab } from './appSlice';
import { useSelector } from 'react-redux';
import { RootState } from './store';

export enum DataTab {
    RiskMetrics = "multi-system metrics",
    Water = "water",
    Land = "land",
    Climate = "climate",
    Economy = "economy",
    Energy = "energy",
    ClimateOpinions = "climate opinions",
    Demographics = "demographics",
    Health = "health",
}

export const TabToTypeMap = Map([
    [DataTab.Climate, DataType.Climate],
    [DataTab.Water, DataType.Water],
    [DataTab.Land, DataType.Land],
    [DataTab.Energy, DataType.Energy],
    [DataTab.Economy, DataType.Economic],
    [DataTab.Demographics, DataType.Demographics],
    [DataTab.Health, DataType.Health],
    [DataTab.ClimateOpinions, DataType.ClimateOpinions],
]);

const dataTabs = Object.values(DataTab);

const Navigation = () => {
    const dispatch = useThunkDispatch();
    const { dataTab: selectedDataTab } = useSelector((state: RootState) => state.app)

    return (
        <nav>
            <ul>
                {dataTabs.map(dataTab =>
                    <li className={selectedDataTab === dataTab ? "selected" : undefined}
                        onClick={event => dispatch(clickTab(event.currentTarget.textContent as DataTab))}
                        key={dataTab}>
                        {dataTab}
                    </li>
                )}
            </ul>
        </nav>
    );
}


export default Navigation;
