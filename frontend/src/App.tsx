import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Home'
import DatasetEditor from './dataset-editor/DatasetEditor'
import Editor from './editor/Editor'
import ReportCard from './report-card/ReportCard'
import Uploader from './uploader/Uploader'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/uploader" element={<Uploader />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/report-card/:category" element={<ReportCard />} />
                <Route path="/report-card/:category/:countyId" element={<ReportCard />} />
                <Route path="/editor/:tabId" element={<Editor />} />
                <Route path="/dataset-editor" element={<DatasetEditor />} />
                <Route path="/" element={<Home />} />
                <Route path="/:tabId" element={<Home />} />
                <Route path="/:tabId/:region" element={<Home />} />
                <Route
                    path="*"
                    element={
                        <div style={{ padding: '1em' }}>
                            <h2>There&apos;s nothing here</h2>
                            <p>
                                <Link to="/">View the maps</Link>
                            </p>
                        </div>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
