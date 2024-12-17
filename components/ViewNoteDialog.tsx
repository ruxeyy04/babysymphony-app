import React, { useEffect, useState } from 'react';
import { Portal, Modal, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

const themes = {
  light: {
    background: "#EFF8FF",
    textColor: "#2D2D2D",
  },
  dark: {
    background: "#1B1B1F",
    textColor: "#D7E0F9",
  },
};
type Note = {
  id: number;
  note: string;
  date_created: string;
  notifid: number;
  userid: number;
};

const ViewNoteDialog: React.FC<{ visible: boolean; notifId: string; onClose: () => void }> = ({ visible, notifId, onClose }) => {
  const [note, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const deviceColorScheme = useColorScheme();
  const currentTheme = theme === 'system_default'
    ? deviceColorScheme === 'dark'
      ? themes.dark
      : themes.light
    : theme === 'dark_mode'
      ? themes.dark
      : themes.light;

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/notif/note', {
          action: 'view',
          notifid: notifId,
        });

        console.log(response.data.data); // Verify the data structure
        setNote(response.data.data); // Set the array of notes directly
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    if (notifId && visible) {
      fetchNote();
    }
  }, [notifId, visible]);

  const styles = StyleSheet.create({
    modalContainer: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: 'white',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    noteContainer: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
    },
    noteText: {
      fontSize: 16,
      marginBottom: 5,
    },
    noteDate: {
      fontSize: 14,
      color: 'gray',
    },
    noNoteText: {
      fontStyle: 'italic',
      textAlign: 'center',
      color: 'gray',
    },
    loadingText: { // Add this style
      textAlign: 'center',
      fontSize: 16,
      color: 'gray',
      marginVertical: 20,
    },
    closeButton: {
      marginTop: 20,
    },
  });
  
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
        <Paragraph style={styles.modalTitle}>Note</Paragraph>

        {loading ? (
          <Paragraph style={styles.loadingText}>Loading...</Paragraph>
        ) : note.length > 0 ? (
          note.map((item: Note) => (
            <View key={item.id} style={styles.noteContainer}>
              <Paragraph style={styles.noteText}>{item.note}</Paragraph>
              <Paragraph style={styles.noteDate}>Created At: {item.date_created}</Paragraph>
            </View>
          ))
        ) : (
          <Paragraph style={styles.noNoteText}>No notes found.</Paragraph>
        )}

        <Button mode="contained" onPress={onClose} style={styles.closeButton}>
          Close
        </Button>
      </Modal>
    </Portal>
  );

};

export default ViewNoteDialog;
