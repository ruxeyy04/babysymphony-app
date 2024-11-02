import React, { useEffect, useState } from 'react';
import { Portal, Dialog, Text, Button } from 'react-native-paper';
import axios from 'axios';
import { StyleSheet } from 'react-native';

// Utility function to format the date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Set to true for 12-hour format
    };
    return date.toLocaleString('en-US', options);
};

const ViewChildInfoDialog: React.FC<{ visible: boolean; childId: any; onClose: () => void }> = ({ visible, childId, onClose }) => {
    const [childInfo, setChildInfo] = useState<any>(null);

    useEffect(() => {
        const fetchChildInfo = async () => {
            if (childId > 0) {
                try {
                    const response = await axios.get(`http://192.168.1.200/api/baby/getspecific.php?id=${childId}`);
                    if (response.data.success) {
                        setChildInfo(response.data.data);
                    } else {
                        console.error('Error fetching child info:', response.data.message);
                    }
                } catch (error) {
                    console.error('Error fetching child info:', error);
                }
            }
        };
        fetchChildInfo();
    }, [childId, visible]);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title style={styles.title}>Child Information</Dialog.Title>
                <Dialog.Content>
                    {childInfo ? (
                        <Text style={styles.contentText}>
                            <Text style={styles.label}>First Name:</Text> {childInfo.fname}{"\n"}
                            <Text style={styles.label}>Middle Name:</Text> {childInfo.mname}{"\n"}
                            <Text style={styles.label}>Last Name:</Text> {childInfo.lname}{"\n"}
                            <Text style={styles.label}>Gender:</Text> {childInfo.gender}{"\n"}
                            <Text style={styles.label}>Age (Months):</Text> {childInfo.months}{"\n"}
                            <Text style={styles.label}>Created At:</Text> {formatDate(childInfo.created_at)}
                        </Text>
                    ) : (
                        <Text style={styles.loadingText}>Loading...</Text>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} style={styles.closeButton}>Close</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
    },
    label: {
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
    closeButton: {
        marginBottom: 10,
    },
});

export default ViewChildInfoDialog;
