import './App.css'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
// import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      {/* <Route exact path="/products" component={Products} />
      <Route exact path="/cart" component={Cart} /> */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)
export default App
