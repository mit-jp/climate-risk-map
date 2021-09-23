import { useThunkDispatch } from './Home';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import DataTab from './DataTab';
import { setDataTab } from './appSlice';

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
