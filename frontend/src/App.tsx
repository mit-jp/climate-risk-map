import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Editor from './editor/Editor'
import Uploader from './uploader/Uploader'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/uploader" element={<Uploader />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default App
