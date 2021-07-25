import React from 'react';
import { Map } from 'immutable';
import { useThunkDispatch } from './Home';
import { clickTab } from './appSlice';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import DataTab from './DataTab';

export const TabToTypeDataCategory = Map([
    [DataTab.RiskMetrics, 8],
    [DataTab.Climate, 3],
    [DataTab.Water, 1],
    [DataTab.Land, 2],
    [DataTab.Energy, 5],
    [DataTab.Economy, 4],
    [DataTab.Demographics, 7],
    [DataTab.ClimateOpinions, 6],
]);

const dataTabs = Object.values(DataTab);

const Navigation = () => {
    const dispatch = useThunkDispatch();
    const selectedDataTab = useSelector((state: RootState) => state.app.dataTab)

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
