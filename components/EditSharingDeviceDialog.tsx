import React, { useEffect, useState } from 'react';
import { Portal, Dialog, Button, Checkbox, Paragraph, TextInput } from 'react-native-paper';
import axios from 'axios';
import { Alert, FlatList, StyleSheet, View, useColorScheme, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useAppTheme';

interface User {
    id: string;
    fname: string;
    lname: string;
    username: string;
}

interface EditDeviceSelectionDialogProps {
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

const EditDeviceSelectionDialog: React.FC<EditDeviceSelectionDialogProps> = ({
    visible,
    onClose,
    userId,
    deviceId,
    fetchDevice,
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
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
            setSelectedUserIds([]);
        }
    }, [visible]);

    useEffect(() => {
        // Filter users based on the search query
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            user.fname.toLowerCase().includes(lowerCaseQuery) ||
            user.lname.toLowerCase().includes(lowerCaseQuery) ||
            user.username.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/device/getsharedevice?deviceid=${deviceId}`);
            if (response.data && response.data.message) {
                setUsers(response.data.message);
                setFilteredUsers(response.data.message);
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load users. Please try again later.');
            console.error(error);
        }
    };

    const handleCheckboxChange = (userId: string) => {
        setSelectedUserIds((prevSelectedUserIds) =>
            prevSelectedUserIds.includes(userId)
                ? prevSelectedUserIds.filter(id => id !== userId) // Uncheck
                : [...prevSelectedUserIds, userId] // Check
        );
    };

    const handleSave = async () => {
        if (selectedUserIds.length === 0) {
            Alert.alert('Error', 'Please select at least one user to remove.');
            return;
        }

        const formData = new FormData();
        formData.append('deviceid', deviceId);
        selectedUserIds.forEach(userId => formData.append('users[]', userId));

        try {
            const response = await axios.post(
                'https://maide-deeplearning.bsit-ln.com/api/device/removesharedusers',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (response.data.success) {
                Alert.alert('Success', 'Users removed successfully.');
                fetchDevice(userId); // Refresh device data
                onClose(); // Close dialog
            } else {
                Alert.alert('Error', response.data.message || 'Failed to remove users.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to remove users. Please try again later.');
            console.error(error);
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>Remove Users</Dialog.Title>
                <Dialog.Content style={styles.dialogContent}>
                    <TextInput
                        mode="outlined"
                        placeholder="Search for a user"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchBar}
                    />
                    {filteredUsers.length > 0 ? (
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.userItem}>
                                    <Checkbox
                                        status={selectedUserIds.includes(item.id) ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheckboxChange(item.id)}
                                        color={currentTheme.textColor}
                                    />
                                    <Paragraph style={{ color: currentTheme.textColor, marginLeft: 8 }}>
                                        {`${item.fname} ${item.lname}`}
                                    </Paragraph>
                                </View>
                            )}
                        />
                    ) : (
                        <Paragraph style={{ color: currentTheme.textColor }}>No users available</Paragraph>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} style={styles.actionButton}>Close</Button>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        disabled={selectedUserIds.length === 0}
                        style={styles.actionButton}
                    >
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionButton: {
        marginHorizontal: 5,
    },
});

export default EditDeviceSelectionDialog;
