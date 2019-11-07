import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { HashRouter, Route } from 'react-router-dom'
import Home from './pages/Home';
import ReadQrCode from './pages/ReadQrCode';
import ViewData from './pages/ViewData';
import CreateNewHistory from './pages/CreateNewHistory';

const App = () => {
    return(
      <HashRouter basename="/">
        <Route exact path="/" component={Home} />
        <Route exact path="/readqrcode" component={ReadQrCode} />
        <Route exact path="/viewdata" component={ViewData} />
        <Route exact path="/newhistory" component={CreateNewHistory} />
      </HashRouter>
    )
}


export default App;
