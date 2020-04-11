import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

function SavedGistModal ({show, onClose, url}) {

    return (
        <Modal isOpen={show} toggle={onClose} className="save-result">
            <ModalHeader toggle={onClose}>Modal title</ModalHeader>
            <ModalBody>

            </ModalBody>
            <ModalFooter>
                <Button size="sm" color="secondary" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}

export default SavedGistModal;
