import React, { useEffect, useState } from 'react';
import { Portal, Dialog, Text, Button, Modal, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

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
const themes = {

    light: {
        background: "#EFF8FF",
        appbar: "#D2EBFF",
        textColor: "#2D2D2D",
        bordercolor: "#ddd"
    },
    dark: {
        background: "#1B1B1F",
        appbar: "#282831",
        textColor: "#D7E0F9",
        bordercolor: "#6a676f"
    },
};
const ViewChildInfoDialog: React.FC<{ visible: boolean; childId: any; onClose: () => void }> = ({ visible, childId, onClose }) => {
    const [childInfo, setChildInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const deviceColorScheme = useColorScheme();
    const currentTheme =
        theme === "system_default"
            ? deviceColorScheme === "dark"
                ? themes.dark
                : themes.light
            : theme === "dark_mode"
                ? themes.dark
                : themes.light;

    useEffect(() => {
        const fetchChildInfo = async () => {
            setLoading(true);
            setError(null);
            if (childId > 0) {
                try {
                    const response = await axios.get(`http://192.168.1.200/api/baby/getspecific?id=${childId}`);
                    if (response.data.success) {
                        setChildInfo(response.data.data);
                    } else {
                        setError(response.data.message);
                    }
                } catch (error) {
                    setError('Failed to fetch child info. Please try again.');
                    console.error('Error fetching child info:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchChildInfo();
    }, [childId, visible]);
    const styles = StyleSheet.create({
        modalTitle: {
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom: 15,
            textAlign: 'center',
        },
        deviceContainer: {
            marginBottom: 15,
            padding: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: currentTheme.bordercolor,
        },
        deviceDetails: {
            marginBottom: 10,
        },
        label: {
            fontWeight: 'bold',
            fontSize: 16,
        },
        childValue: {
            fontSize: 16,
            paddingVertical: 5,
            paddingLeft: 10,
            borderLeftWidth: 3,
            borderLeftColor: '#d0bcff',
            borderRadius: 5,
            borderWidth: 1,
            borderRightColor: currentTheme.bordercolor,
            borderTopColor: currentTheme.bordercolor,
            borderBottomColor: currentTheme.bordercolor,
        },
        childContainer: {
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: currentTheme.bordercolor,
            borderRadius: 8,
        },
        childName: {
            fontWeight: 'bold',
            fontSize: 15,
        },
        childDescription: {
            fontSize: 14,
        },
        noChildrenText: {
            fontStyle: 'italic',
            textAlign: 'center',
        },
        loadingText: {
            textAlign: 'center',
            fontSize: 16,
            color: 'gray',
            marginVertical: 20,
        },
        closeButton: {
            marginTop: 15,
        },
        modalContainer: {
            padding: 20,
            margin: 20,
            borderRadius: 10,
        },
    });

    return (
        <Portal>
              <Modal visible={visible} onDismiss={onClose} contentContainerStyle={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
              <Paragraph style={styles.modalTitle}>Baby Information</Paragraph>
              {loading ? (
                        <Text style={styles.loadingText}>Loading...</Text>
                    ) : error ? (
                        <Text style={styles.loadingText}>{error}</Text>
                    ) : childInfo ? ( // Ensure childInfo is not null before accessing its properties
                        <View style={styles.childContainer}>
                            <Text style={styles.label}>First Name:</Text>
                            <Text style={styles.childValue}>{childInfo.fname}</Text>
                            
                            <Text style={styles.label}>Middle Name:</Text>
                            <Text style={styles.childValue}>{childInfo.mname}</Text>

                            <Text style={styles.label}>Last Name:</Text>
                            <Text style={styles.childValue}>{childInfo.lname}</Text>

                            <Text style={styles.label}>Gender:</Text>
                            <Text style={styles.childValue}>{childInfo.gender}</Text>

                            <Text style={styles.label}>Age (Months):</Text>
                            <Text style={styles.childValue}>{childInfo.months}</Text>

                            <Text style={styles.label}>Created At:</Text>
                            <Text style={styles.childValue}>{formatDate(childInfo.created_at)}</Text>
                        </View>
                    ) : (
                        <Text style={styles.loadingText}>No child information available.</Text>
                    )}
                    <Button mode="contained" onPress={onClose} style={styles.closeButton}>
                    Close
                </Button>
              </Modal>
        </Portal>
    );
};


export default ViewChildInfoDialog;
