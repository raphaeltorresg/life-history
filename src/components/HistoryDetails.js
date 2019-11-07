import React from 'react'
import { Grid, Form } from 'semantic-ui-react';


const HistoryDetails = props => {
    const { name, dateBorn, dateEnd, lifeHistory, qrcode } = props.history
    return(
        <Grid centered style={{padding:10}}>
            <Form>
                {!(props.noQrCode) &&
                <Form.Field>
                    <label>QR Code Locator</label>
                    <img src={qrcode} alt={"QRCODE"} style={{width:200, height:200}} onClick={() => window.open(qrcode)} />
                </Form.Field>
                }
                <Form.Field>
                    <label>Name</label>
                    <p>{name}</p>
                </Form.Field>
                <Form.Field>
                    <label>Date Born</label>
                    <p>{dateBorn}</p>
                </Form.Field>
                <Form.Field>
                    <label>Date Death</label>
                    <p>{dateEnd}</p>
                </Form.Field>
                <Form.Field>
                    <label>Life History</label>
                    <p>{lifeHistory}</p>
                </Form.Field>
            </Form>
        </Grid>
    )
}

export default HistoryDetails