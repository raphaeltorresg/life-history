import React, { useState }  from 'react'
import { Grid, Form, TextArea, Button, Modal, Input, Message, Segment, Dimmer, Loader, Checkbox, Table } from 'semantic-ui-react';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import { getArweaveUser, generateNewHistoryTransaction, arweaveNode, sendArweaveTransaction } from '../ar';
import QRCode from 'qrcode'
import ModalViewHistory from '../components/ModalViewHistory';
import ModalLoading from '../components/ModalLoading';


const CreateNewHistory = props => {
        const [dateBorn, setDateBorn] = useState(new Date());
        const [dateEnd, setDateEnd] = useState(new Date());
        const [name, setName] = useState('')
        const [lifeHistory, setLifeHistory] = useState('')
        const [arweaveAccount, setArAccount] = useState({ wallet: false, address:'', winstonBalance: 0, arweaveBalance: 0, history: [] })
        const [loadAccModal, setAccModal] = useState(true)
        const [confirmHstModal, setConfirmHstModal] = useState(false)
        const [loading, setLoading] = useState(false)
        const [transaction, setTransaction] = useState(false)
        const [confirmTransaction, setConfirmTransaction] = useState(false)
        const [checkboxConfirm, setConfirmCheckBox] = useState(false)
        const [modalHistory, setModalHistory] = useState(false) //List of History
        const [detailsHistory, setDetailsHistory] = useState(false) //Details of History

        const loadAccount = async(walletFile) => {
            try{
                setLoading(true)
                setAccModal(false)
                const { wallet, address, winstonBalance, arweaveBalance, history } = await getArweaveUser(walletFile)
                setArAccount({ wallet, address, winstonBalance, arweaveBalance, history })
                console.log(history)
                setLoading(false)
            }catch(err){
                setAccModal(true)
                setLoading(false)
                alert('Failed on load Arweave Account, check your wallet file and your connection')
            }
        }

        const prepareTransaction = async() => {
            try{
                setLoading(true)
                const transaction = await generateNewHistoryTransaction(name, dateBorn, dateEnd, lifeHistory, arweaveAccount.wallet)
                console.log(transaction)
                setTransaction(transaction)
                setConfirmHstModal(true)
                setLoading(false)
            }catch(err){
                setLoading(false)
                alert('Failed on prepare transaction')
                console.log(err)
            }
        }

        const sendNewHistory = async() => {
            try{
                if(!checkboxConfirm){
                    alert('View the checkbox')
                    return
                }
                setLoading(true)
                setConfirmHstModal(false)
                const transactionId = await sendArweaveTransaction(transaction)
                setConfirmTransaction(transactionId)
                setLoading(false)
                setTransaction(false)
            }catch(err){
                setLoading(false)
                setConfirmHstModal(true)
                alert('Failed to deploy the transaction')
            }
        }

        const viewDetails = async(history) => {
            try{
                setLoading(true)
                setModalHistory(false)
                const qrcode = await QRCode.toDataURL(`historypeoplear-${history.transactionId}`)
                history.qrcode = qrcode
                setDetailsHistory(history)
                setLoading(false)
            }catch(err){
                console.log(err)
                setLoading(false)
                setModalHistory(true)
            }
        }

        const closeViewDetails = () => {
            setDetailsHistory(false)
            setModalHistory(true)
        }

        if(confirmTransaction){
            return(
                <Grid centered>
                    <Message>
                        <Message.Header>
                            Your transaction has been submitted to Arweave Blockchain
                        </Message.Header>
                        <p>After mining your data will be available on the network.</p>
                        <p>Transaction Id:</p>
                        <p>{confirmTransaction}</p>
                    </Message>
                </Grid>
            )
        }

        return(
            <Grid centered>
                <ModalLoadAccount open={loadAccModal} load={loadAccount} />
                <ModalConfirmTransaction 
                    open={confirmHstModal} 
                    name={name} dateBorn={dateBorn}
                    dateEnd={dateEnd} lifeHistory={lifeHistory}
                    closeModal={() => setConfirmHstModal(false)}
                    transaction={transaction} userBalance={arweaveAccount.winstonBalance}
                    sendNewHistory={sendNewHistory} checkboxConfirm={checkboxConfirm}
                    setConfirmCheckBox={setConfirmCheckBox}
                />
                <ModalListHistory 
                    open={modalHistory}
                    history={arweaveAccount.history}
                    setModalHistory={setModalHistory}
                    viewDetails={viewDetails}
                />
                <ModalViewHistory open={detailsHistory} history={detailsHistory} closeViewDetails={closeViewDetails} />
                <ModalLoading open={loading} />
                <Grid.Row centered>
                    <Message>
                        <Message.Header>Arweave Account</Message.Header>
                        <p>{arweaveAccount.address}</p>
                        <p style={{fontSize:11, marginBottom:0}}>Balance</p>
                        <p style={{marginTop:0}}>{arweaveAccount.arweaveBalance} AR</p>
                        <Button onClick={() => setModalHistory(true)}>View Upload History</Button>
                    </Message>
                </Grid.Row>
                <Grid.Row centered>
                    <p align="center" style={{fontSize:16, fontWeight:700}}>-> Create New History</p>
                </Grid.Row>
                <Form style={{margin:10}}>
                    <Form.Field>
                        <label>Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                    </Form.Field>
                <Grid columns={2} divided>
                <Grid.Row>
                <Grid.Column>
                <Form.Field>
                <label>Date Born</label>
                 <DatePicker
                    selected={dateBorn}
                    onChange={date => setDateBorn(date)}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={40}
                    scrollableYearDropdown
                />
                </Form.Field>
                </Grid.Column>

                <Grid.Column>
                <Form.Field>
                <label>Date Death</label>
                <DatePicker
                    selected={dateEnd}
                    onChange={date => setDateEnd(date)}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={40}
                    scrollableYearDropdown
                />
                </Form.Field>
                </Grid.Column>
                </Grid.Row>
                </Grid>

                <Form.Field>
                    <label style={{marginTop:10}}>Life History</label>
                    <TextArea rows={8} value={lifeHistory} onChange={(e) => setLifeHistory(e.target.value)} placeholder='Tell us more about the life of the person' />
                </Form.Field>

                <Form.Field>
                    <Button onClick={prepareTransaction} content='Primary'>Prepare Transaction</Button>
                </Form.Field>
                </Form>
            </Grid>
        )
}

const ModalLoadAccount = props => (
    <Modal open={props.open}>
      <Modal.Header>Load Arweave Account</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            For upload a new people history you need to connect with your Arweave account by loading the wallet file.
          </p>
          <Input type="file" accept="application/JSON"  onChange={(e) => props.load(e.target.files[0])}/>
        </Modal.Description>
      </Modal.Content>
    </Modal>
)

const ModalConfirmTransaction = props => (
    <Modal open={props.open}>
      <Modal.Header>Confirm New History</Modal.Header>
      <Modal.Content>
        <Grid centered>
            <Form style={{margin:30}}>
            <Form.Field>
                <label>Name</label>
                <input value={props.name} />
            </Form.Field>
            <Grid columns={2} divided>
            <Grid.Row>
            <Grid.Column>
            <Form.Field>
            <label>Date Born</label>
            <input value={props.dateBorn.toISOString().substring(0, 10)} />
            </Form.Field>
            </Grid.Column>

            <Grid.Column>
            <Form.Field>
            <label>Date Death</label>
            <input value={props.dateEnd.toISOString().substring(0, 10)} />
            </Form.Field>
            </Grid.Column>
            </Grid.Row>
            </Grid>

            <Form.Field>
                <label style={{marginTop:10}}>Life History</label>
                <TextArea rows={8} value={props.lifeHistory} />
            </Form.Field>

            <Form.Field>
                <label style={{marginTop:10}}>Transaction Fee</label>
                <p>{arweaveNode.ar.winstonToAr(props.transaction.reward)} AR</p>
            </Form.Field>

            <Form.Field>
                {(parseInt(props.transaction.reward,10) < parseInt(props.userBalance,10)) ?
                <Segment>
                    <Checkbox checked={props.confirmCheckBox} onChange={props.setConfirmCheckBox} label={{ children: 'I acknowledge all responsibility for the content sent and I am aware that the data cannot be deleted by anyone' }} />
                    <Button onClick={props.sendNewHistory} content='Primary'>Confirm Transaction</Button>
                </Segment>
                    :
                    <p>No Arweave Balance Available</p>
                }
            </Form.Field>
            <Form.Field>
                <Button color='red' onClick={props.closeModal}>Cancel</Button>
            </Form.Field>
            
            </Form>
        </Grid>
        </Modal.Content>
        </Modal>
)

const ModalListHistory = props => {
    return(
        <Modal open={props.open} onClose={() => props.setModalHistory(false)}>
            <Modal.Header>History List</Modal.Header>
                <Modal.Content>
                    <Grid centered>
                    <Table celled padded>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Person Name</Table.HeaderCell>
                            <Table.HeaderCell>Details</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {props.history.map((x, index) => (
                            <Table.Row>
                                <Table.Cell>{x.name}</Table.Cell>
                                <Table.Cell onClick={()=>props.viewDetails(x)}>Details</Table.Cell>
                            </Table.Row>
                        ))}
                        </Table.Body>
                    </Table>
                    </Grid>
                </Modal.Content>
        </Modal>
    )
}




  



export default CreateNewHistory