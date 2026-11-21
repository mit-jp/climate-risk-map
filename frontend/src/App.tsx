import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Home'
import DataSourceEditor from './editor/DataSourceEditor'
import DatasetEditor from './editor/DatasetEditor'
import Editor from './editor/Editor'
import LandingPage from './landing-page/LandingPage'
import ReportCard from './report-card/ReportCard'
import Uploader from './uploader/Uploader'
import FAQ from './landing-page/FAQ'
import SupportersCollaborators from './landing-page/SupportersCollaborators'
import TutorialsAndUseCases from './landing-page/TutorialsAndUseCases'
import Resources from './landing-page/Resources'
import Methodology from './landing-page/Methodology'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path="/supporters-and-collaborators" element={<SupportersCollaborators />} />
                <Route path="/tutorials-and-use-cases" element={<TutorialsAndUseCases />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/uploader" element={<Uploader />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/report-card/:category" element={<ReportCard />} />
                <Route path="/report-card/:category/:countyId" element={<ReportCard />} />
                <Route path="/editor/:tabId" element={<Editor />} />
                <Route path="/dataset-editor" element={<DatasetEditor />} />
                <Route path="/data-source-editor" element={<DataSourceEditor />} />
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
