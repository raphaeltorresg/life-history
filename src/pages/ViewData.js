import React from 'react';
import { Container } from 'semantic-ui-react';
import HistoryDetails from '../components/HistoryDetails';
import{ Redirect } from 'react-router-dom'

const ViewData = props => {
  if(!props.location.state){
    return(
        <Redirect to={"/"}/>
    )
}
    return(
      <Container>
        <HistoryDetails noQrCode={true} history={props.location.state.fetchData} />
      </Container>
    )
}


export default ViewData;
