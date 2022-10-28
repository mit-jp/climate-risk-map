import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import Editor from './editor/Editor'
import Uploader from './uploader/Uploader'
import ReportCard from './report-card/ReportCard'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/uploader" element={<Uploader />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/report-card" element={<ReportCard />} />
                <Route path="/report-card/:category/:countyId" element={<ReportCard />} />
                <Route path="/editor/:tabId" element={<Editor />} />
                <Route path="/" element={<Home />} />
                <Route path="/:tabId" element={<Home />} />
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
