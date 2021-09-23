import { Map } from 'immutable';
import { useThunkDispatch } from './Home';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import DataTab from './DataTab';
import { setDataTab } from './appSlice';

export const DatabaseToTab = Map([
    [8, DataTab.RiskMetrics],
    [3, DataTab.Climate],
    [1, DataTab.Water],
    [2, DataTab.Land],
    [5, DataTab.Energy],
    [4, DataTab.Economy],
    [7, DataTab.Demographics],
    [6, DataTab.ClimateOpinions],
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
                        onClick={event => dispatch(setDataTab(event.currentTarget.textContent as DataTab))}
                        key={dataTab}>
                        {dataTab}
                    </li>
                )}
            </ul>
        </nav>
    );
}


export default Navigation;
