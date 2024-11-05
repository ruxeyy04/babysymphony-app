// DeviceSelectionDialog.tsx
import React, { useEffect, useState } from 'react';
import { Portal, Dialog, Button, RadioButton, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { Alert, FlatList, StyleSheet, View, useColorScheme } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

interface Device {
    id: string;
    name: string;
    brand: string;
    model: string;
}

interface DeviceSelectionDialogProps {
    visible: boolean;
    onClose: () => void;
    fetchChildren: (userId: string) => Promise<void>;
    childId: any;
    userID: any;
}
const themes = {
    light: {
        background: "#EFF8FF",
        appbar: "#D2EBFF",
        textColor: "#2D2D2D",
        bordercolor: "#ddd",
    },
    dark: {
        background: "#1B1B1F",
        appbar: "#282831",
        textColor: "#D7E0F9",
        bordercolor: "#6a676f",
    },
};

const DeviceSelectionDialog: React.FC<DeviceSelectionDialogProps> = ({ visible, onClose, fetchChildren, childId, userID }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<any | null>(null);
    const { theme } = useTheme();

    const deviceColorScheme = useColorScheme();
    const currentTheme = theme === "system_default"
        ? deviceColorScheme === "dark"
            ? themes.dark
            : themes.light
        : theme === "dark_mode"
            ? themes.dark
            : themes.light;

    useEffect(() => {
        const fetchVacantDevices = async () => {
            try {
                const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/baby/vacantdevice?userid=${userID}`);
                if (response.data.success) {
                    setDevices(response.data.data);
                } else {
                    setDevices(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching vacant devices:', error);
            }
        };

        if (visible) {
            fetchVacantDevices();
        }
    }, [visible]);

    useEffect(() => {
        if (!visible) {
            setSelectedDeviceId(null);
        }
    }, [visible]);

    const handleSave = async () => {
        if (selectedDeviceId && childId) {
            console.log(`Selected device ID: ${selectedDeviceId}`);
            console.log(`Assigning to child ID: ${childId}`);
    
            try {
                const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/assign.php', {
                    device_id: selectedDeviceId,
                    baby_id: childId,
                });
    
                if (response.data.success) {
                    Alert.alert('Success',response.data.message);
                    await fetchChildren(userID); 
                } else {
                    console.warn('Error assigning device:', response.data.message);
                }
            } catch (error) {
                console.error('Error during assignment:', error);
            }
    
            onClose();
        } else {
            console.warn("No device or child selected");
        }
    };
    
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>Select a Device</Dialog.Title>
                <Dialog.Content>
                    {devices.length > 0 ? (
                        <RadioButton.Group onValueChange={(value) => setSelectedDeviceId(value)} value={selectedDeviceId}>
                            <FlatList
                                data={devices}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.deviceItem}>
                                        <RadioButton.Item
                                            label={`${item.name} (${item.brand}, ${item.model})`}
                                            value={item.id}
                                            labelStyle={{ color: currentTheme.textColor }}
                                        />
                                    </View>
                                )}
                            />
                        </RadioButton.Group>
                    ) : (
                        <Paragraph style={{ color: currentTheme.textColor }}>No devices available</Paragraph>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} style={styles.actionButton}>Close</Button>
                    <Button mode="contained" onPress={handleSave} disabled={!selectedDeviceId} style={styles.actionButton}>
                        Save
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    deviceItem: { marginBottom: 10 },
    actionButton: { marginHorizontal: 5 },
});

export default DeviceSelectionDialog;
