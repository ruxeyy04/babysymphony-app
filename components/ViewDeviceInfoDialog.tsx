import React, { useEffect, useState } from 'react';
import { Portal, Modal, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

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

const ViewDeviceInfoDialog: React.FC<{ visible: boolean; childId: any; onClose: () => void }> = ({ visible, childId, onClose }) => {
    const [deviceInfo, setDeviceInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
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
        const fetchDeviceInfo = async () => {
            setLoading(true); // Start loading
            if (childId) {
                try {
                    const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/device/getspecific?id=${childId}`);
                    if (response.data.success) {
                        setDeviceInfo(response.data.data);
                    } else {
                        console.error('Error fetching device info:', response.data.message);
                    }
                } catch (error) {
                    console.error('Error fetching device info:', error);
                } finally {
                    setLoading(false); // End loading
                }
            } else {
                setLoading(false); // End loading if no childId
            }
        };
        fetchDeviceInfo();
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
        deviceValue: {
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
                <Paragraph style={styles.modalTitle}>Device Information</Paragraph>

                {/* Loading State */}
                {loading ? (
                    <Paragraph style={styles.loadingText}>Loading...</Paragraph>
                ) : (
                    <>
                        {/* Device Information Container */}
                        {deviceInfo && (
                            <View style={styles.deviceContainer}>
                                <View style={styles.deviceDetails}>
                                    <Paragraph style={styles.label}>Device ID:</Paragraph>
                                    <Paragraph style={styles.deviceValue}>{deviceInfo.device.id}</Paragraph>
                                </View>
                                <View style={styles.deviceDetails}>
                                    <Paragraph style={styles.label}>Device Name:</Paragraph>
                                    <Paragraph style={styles.deviceValue}>{deviceInfo.device.name}</Paragraph>
                                </View>
                                <View style={styles.deviceDetails}>
                                    <Paragraph style={styles.label}>Added At:</Paragraph>
                                    <Paragraph style={styles.deviceValue}>{deviceInfo.device.created_at}</Paragraph>
                                </View>
                            </View>
                        )}
                        {deviceInfo && deviceInfo.babies.length > 0 ? (<Paragraph style={styles.modalTitle}>Children Associated with Device</Paragraph>) : (null)}

                        {deviceInfo && deviceInfo.babies.length > 0 ? (
                            deviceInfo.babies.map((baby: any) => (
                                <View key={baby.id} style={styles.childContainer}>
                                    <Paragraph style={styles.childName}>{baby.nickname}</Paragraph>
                                    <Paragraph style={styles.childDescription}>Gender: {baby.gender}, Age: {baby.months} months</Paragraph>
                                </View>
                            ))
                        ) : (
                            <Paragraph style={styles.noChildrenText}>No Baby Associated with this Device</Paragraph>
                        )}
                    </>
                )}
                <Button mode="contained" onPress={onClose} style={styles.closeButton}>
                    Close
                </Button>
            </Modal>
        </Portal>
    );

};


export default ViewDeviceInfoDialog;
