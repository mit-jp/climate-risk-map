import { useSelector } from 'react-redux'
import DataTab from './DataTab'
import { RootState } from './store'
import css from './Home.module.css'

function SiteOverview() {
    const dataTab = useSelector((state: RootState) => state.app.dataTab)

    if (dataTab !== DataTab.RiskMetrics) {
        return null
    }

    return (
        <div id={css.siteOverview}>
            <p>
                You can select multiple metrics and adjust their relative importance to view the
                combined impact. To see additional and supporting data, select the other categories.
            </p>
        </div>
    )
}

export default SiteOverview
