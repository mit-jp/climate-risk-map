import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Home'
import Editor from './editor/Editor'
import Uploader from './uploader/Uploader'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/uploader">
                    <Uploader />
                </Route>
                <Route path="/editor">
                    <Editor />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
