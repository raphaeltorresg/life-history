import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

class Home extends React.Component{
  state = {

  }

  render(){
    return(
      <Grid centered style={{}}>
          <p align="center" style={{fontSize: 18, fontWeight: 500}}>Store on Blockchain and never forget the memories of dear people</p>
          <Grid.Row centered>
                <Link to={"/readqrcode"}>
                    <Button style={{ margin: 10, width: 200, fontSize:18 }} as='a'>Read Qr Code</Button>
                </Link>
          </Grid.Row>
          <Grid.Row centered>
              <Link to={"/newhistory"}>
                <Button style={{ margin: 10, width: 200, fontSize:18  }} as="a">Admin</Button>
              </Link>
          </Grid.Row>
          <Grid.Row centered>
              <p style={{marginTop: 30}}>Powered by Arweave</p>
          </Grid.Row>
      </Grid>
    )
  }
}

export default Home;
