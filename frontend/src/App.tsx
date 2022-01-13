import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Home'
import Editor from './editor/Editor'

function App() {
    return (
        <Router>
            <Switch>
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
