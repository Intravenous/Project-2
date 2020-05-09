import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/Home'
import NavBar from './components/NavBar'
import SearchPage from './components/SearchPage'
import Birthday from './components/Birthday'
import Playlist from './components/Playlist'

import 'bulma'
import './styles/style.scss'

const App = () => (
  <BrowserRouter basename='/Project-2'>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/search' component={SearchPage} />
      <Route exact path='/birthday' component={Birthday} />
      <Route exact path='/playlist' component={Playlist} />
      <Route />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)