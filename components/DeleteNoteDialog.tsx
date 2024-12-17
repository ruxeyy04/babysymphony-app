import React from 'react';
import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';
import axios from 'axios';

const DeleteNoteDialog: React.FC<{ 
    visible: boolean; 
    noteId: string; 
    onClose: () => void; 
    onDelete: () => void; 
}> = ({ visible, noteId, onClose, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.post('https://maide-deeplearning.bsit-ln.com/api/notif/note', {
                action: 'delete',
                noteid: noteId,
            });
            onDelete();
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            onClose();
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title>Delete Confirmation</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Are you sure you want to delete this note?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>Cancel</Button>
                    <Button onPress={handleDelete} style={{ marginLeft: 10 }}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default DeleteNoteDialog;
