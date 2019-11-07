import React  from 'react'
import { Modal } from 'semantic-ui-react'
import HistoryDetails from "./HistoryDetails"

const ModalViewHistory = props => {
    return(
        <Modal open={props.open} onClose={props.closeViewDetails}>
            <Modal.Content>
                <HistoryDetails history={props.history}/>
            </Modal.Content>
        </Modal>
    )
}

export default ModalViewHistory