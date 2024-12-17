import React, { useState } from 'react';
import { Portal, Modal, TextInput, Button, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

const themes = {
    light: {
        background: "#EFF8FF",
        textColor: "#2D2D2D",
        bordercolor: "#ddd",
    },
    dark: {
        background: "#1B1B1F",
        textColor: "#D7E0F9",
        bordercolor: "#6a676f",
    },
};

const AddNoteDialog: React.FC<{ visible: boolean; notifId: string; userId: string; onClose: () => void; onNoteAdded: () => void }> = ({ visible, notifId, userId, onClose, onNoteAdded }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const deviceColorScheme = useColorScheme();
    const currentTheme = theme === 'system_default'
        ? deviceColorScheme === 'dark'
            ? themes.dark
            : themes.light
        : theme === 'dark_mode'
            ? themes.dark
            : themes.light;

    const handleAddNote = async () => {
        setLoading(true);
        try {
            await axios.post('https://maide-deeplearning.bsit-ln.com/api/notif/note', {
                action: 'add',
                notifid: notifId,
                userid: userId,
                note,
            });
            onNoteAdded();
            onClose();
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        modalContainer: {
            padding: 20,
            margin: 20,
            borderRadius: 10,
            backgroundColor: currentTheme.background,
        },
        input: {
            marginBottom: 15,
            backgroundColor: 'transparent',
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
        },
    });

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
                <Paragraph>Add Note</Paragraph>
                <TextInput
                    label="Note"
                    value={note}
                    onChangeText={setNote}
                    style={styles.input}
                    multiline
                />
                <View style={styles.buttonsContainer}>
                    <Button mode="outlined" onPress={onClose} disabled={loading}>Cancel</Button>
                    <Button mode="contained" onPress={handleAddNote} loading={loading} style={{ marginLeft: 10 }}>Save</Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default AddNoteDialog;
