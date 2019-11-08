import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import QrReader from 'react-qr-reader'
import { getHistory } from '../ar';
import ModalLoading from '../components/ModalLoading';
import { Grid } from 'semantic-ui-react';

const ReadQrCode = props => {
    const [qrCodeData, setQrCodeData] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleScan = async(data) => {
      if(!data){
        return
      }
      try{
        setLoading(true)
        const url = data.substring(16)
        const historyData = await getHistory(url)
        setLoading(false)
        setQrCodeData(historyData)
      }catch(err){
        setLoading(false)
        alert('Not Found')
      }
    }
    
    const handleError = () => {
      
    }

    if(qrCodeData){
        return(
            <Redirect to={{
                pathname: '/viewdata',
                state: { fetchData: qrCodeData }
            }}/>
        )
    }
    return(
        <Grid centered style={{ margin: 20, padding: 20}}>
            <QrReader
            delay={300}
            onError={handleError}
            onScan={(data) => handleScan(data)}
            style={{ heigth:  '250px', width: '250px', margin: 20 }}
            />
            <ModalLoading open={loading} />
        </Grid>
    )
}


export default ReadQrCode;
