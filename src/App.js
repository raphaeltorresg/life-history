import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { HashRouter, Route } from 'react-router-dom'
import Home from './pages/Home';
import ReadQrCode from './pages/ReadQrCode';
import ViewData from './pages/ViewData';
import CreateNewHistory from './pages/CreateNewHistory';
import { Container } from 'semantic-ui-react';

const App = () => {
    return(
      <Container style={{backgroundColor: '#7289a7', margin: 10, borderRadius: 30}}>
      <p align="center" style={{fontSize: 26, fontWeight: 700, marginTop:15}}>History Life</p>
      <HashRouter basename="/">
        <Route exact path="/" component={Home} />
        <Route exact path="/readqrcode" component={ReadQrCode} />
        <Route exact path="/viewdata" component={ViewData} />
        <Route exact path="/newhistory" component={CreateNewHistory} />
      </HashRouter>
      </Container>
    )
}


export default App;
