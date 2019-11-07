import React from 'react';
import { Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

class Home extends React.Component{
  state = {

  }

  render(){
    return(
      <Container>
          <Link to={"/readqrcode"}>
              <Button style={{ margin: 10 }} as='a'>Read Qr Code</Button>
          </Link>
          <Link to={"/newhistory"}>
          <Button style={{ margin: 10 }} as="a">Admin</Button>
          </Link>
      </Container>
    )
  }
}

export default Home;
