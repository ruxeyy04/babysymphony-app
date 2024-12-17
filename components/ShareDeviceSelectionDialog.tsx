import React, { useEffect, useState } from 'react';
import { Portal, Dialog, Button, RadioButton, Paragraph, TextInput } from 'react-native-paper';
import axios from 'axios';
import { Alert, FlatList, StyleSheet, View, useColorScheme, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

interface User {
    id: string;
    fname: string;
    lname: string;
    username: string;
}

interface ShareDeviceSelectionDialogProps {
    visible: boolean;
    onClose: () => void;
    userId: any;
    deviceId: any;
    fetchDevice: (userId: string) => void;
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

const ShareDeviceSelectionDialog: React.FC<ShareDeviceSelectionDialogProps> = ({
    visible,
    onClose,
    userId,
    deviceId,
    fetchDevice,
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
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
        if (visible) {
            fetchUsers();
        } else {
            setSearchQuery('');
            setSelectedUserId('');
        }
    }, [visible]);

    useEffect(() => {
        // Filter users based on the search query
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            (user.fname?.toLowerCase() || '').includes(lowerCaseQuery) ||
            (user.lname?.toLowerCase() || '').includes(lowerCaseQuery) ||
            (user.username?.toLowerCase() || '').includes(lowerCaseQuery)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);
    

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/device/getsharelistuserexept?userid=${userId}&device_id=${deviceId}`);
            if (response.data && response.data.users) {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
                if (response.data.users.length > 0) {
                    setSelectedUserId(response.data.users[0].id); // Automatically select the first user.
                }
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load users. Please try again later.');
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!selectedUserId) return;

        try {
            const formData = new URLSearchParams();
            formData.append('userid', selectedUserId);
            formData.append('deviceid', deviceId);
            formData.append('shared_by', userId);

            console.log('Payload:', { selectedUserId, deviceId, userId });
            const response = await axios.post(
                'https://maide-deeplearning.bsit-ln.com/api/device/savesharedevice',
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            console.log('API Response:', response.data);

            if (response.status === 200) {
                Alert.alert('Success', 'Device shared successfully!');
                fetchDevice(userId);
                onClose();
            } else {
                Alert.alert('Error', 'Failed to save the device. Please try again.');
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'Failed to save the device. Please try again.');
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>Select a User</Dialog.Title>
                <Dialog.Content style={styles.dialogContent}>
                    <TextInput
                        mode="outlined"
                        placeholder="Search for a user"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchBar}
                    />
                    {filteredUsers.length > 0 ? (
                        <RadioButton.Group onValueChange={(value) => setSelectedUserId(value)} value={selectedUserId}>
                            <FlatList
                                data={filteredUsers}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.userItem}>
                                        <RadioButton.Item
                                            label={`${item.fname} ${item.lname}`}
                                            value={item.id}
                                            labelStyle={{ color: currentTheme.textColor }}
                                        />
                                    </View>
                                )}
                            />
                        </RadioButton.Group>
                    ) : (
                        <Paragraph style={{ color: currentTheme.textColor }}>No users available</Paragraph>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} style={styles.actionButton}>Close</Button>
                    <Button mode="contained" onPress={handleSave} disabled={!selectedUserId} style={styles.actionButton}>
                        Save
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};


const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    dialogContent: {
        maxHeight: screenHeight * 0.8, // Limit the height to 80% of the screen
        paddingBottom: 100,
    },
    searchBar: {
        marginBottom: 10,
    },
    userItem: {
        marginBottom: 10,
    },
    actionButton: {
        marginHorizontal: 5,
    },
});


export default ShareDeviceSelectionDialog;
