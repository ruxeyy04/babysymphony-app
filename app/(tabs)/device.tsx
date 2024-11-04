import ViewDeviceInfoDialog from '@/components/ViewDeviceInfoDialog';
import { useTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Alert } from 'react-native';
import { Avatar, Button, Card, FAB, Modal, PaperProvider, Paragraph, TextInput, Menu, Divider, Searchbar, Text, Dialog, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DeviceInfo {
  device_id: string;
  name: string;
  brand: string;
  model: string;
  created_at: string;
}
interface Devices {
  device_id: string;
  name: string;
  brand: string;
  model: string;
  created_at: string;
}
const themes = {
  light: {
    background: "#EFF8FF",
    appbar: "#D2EBFF",
    textColor: "#2D2D2D",
  },
  dark: {
    background: "#1B1B1F",
    appbar: "#282831",
    textColor: "#D7E0F9",
  },
};
const Devices = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const deviceColorScheme = useColorScheme();
  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
        ? themes.dark
        : themes.light;
  const [visibleDelete, setDeleteVisible] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [addDeviceVisible, setAddDeviceVisible] = useState<boolean>(false);
  const [viewDeviceVisible, setViewDeviceVisible] = useState<boolean>(false);
  const [updateDeviceVisible, setUpdateDeviceVisible] = useState<boolean>(false);
  const [deviceOptionsVisible, setDeviceOptionsVisible] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<Devices | null>(null);
  const [devices, setDevices] = useState<Devices[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
          fetchDevice(id)
        }
      } catch (error) {
        console.error('Failed to load user ID:', error);
      }
    };


    fetchUserId();
  }, []);
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return date.toLocaleDateString('en-US', options);
  };

  const fetchDevice = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.1.200/api/device/get?userid=${userId}`);
      if (response.data.success) {
        const devices = response.data.data.map((device: any) => ({
          device_id: device.id, name: device.name, brand: device.brand, model: device.model, created_at: device.created_at
        }));
        setDevices(devices);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };
  const handleMenuOpen = (id: string, anchor: { x: number; y: number }) => {
    setMenuAnchor(anchor);
    setDeviceOptionsVisible(id);
  };

  const handleMenuClose = () => {
    setDeviceOptionsVisible(null);
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: string, deviceId: string) => {
    const selectedDevice = devices.find((device) => device.device_id === deviceId);

    switch (action) {
      case 'view':
        if (selectedDevice) {
          setSelectedDevice(selectedDevice);
          setViewDeviceVisible(true);

        }
        break;
      case 'update':
        console.log(`Update device ID: ${deviceId}`);
        if (selectedDevice) {
          setSelectedDevice(selectedDevice);
          setUpdateDeviceVisible(true);
          setUpdatedDevice(selectedDevice)
        }
        break;
      case 'delete':
        if (selectedDevice) {
          setSelectedDevice(selectedDevice);
          setDeleteVisible(true);
        }
        console.log(`Delete device ID: ${deviceId}`);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  const handleAddDevice = async () => {
    setErrorDevice({ device_id: '', name: '', brand: '', model: '' });

    let valid = true;
    if (!newDevice.device_id) {
      setErrorDevice((prev) => ({ ...prev, device_id: 'Device ID is required' }));
      valid = false;
    }
    if (!newDevice.name) {
      setErrorDevice((prev) => ({ ...prev, name: 'Device Name is required' }));
      valid = false;
    }
    if (!newDevice.brand) {
      setErrorDevice((prev) => ({ ...prev, brand: 'Device Brand is required' }));
      valid = false;
    }
    if (!newDevice.model) {
      setErrorDevice((prev) => ({ ...prev, model: 'Device Model is required' }));
      valid = false;
    }
    if (valid) {
      try {
        const response = await axios.post('http://192.168.1.200/api/device/add', {
          device_id: newDevice.device_id,
          name: newDevice.name,
          model: newDevice.model,
          brand: newDevice.brand,
          userid: userId,
        });

        if (response.data.success) {
          Alert.alert('Success', response.data.message)
          setNewDevice({ device_id: '', name: '', brand: '', model: '', created_at: '' });
          setAddDeviceVisible(false)
          setDevices((prevDevices) => [...prevDevices, newDevice]);
        } else {
          console.log(response.data)
          Alert.alert('Warning', response.data.message);
        }
      } catch (error) {
        console.error(error);
        alert('There was an error adding the child. Please try again later.');
      }
    }
  };
  const handleUpdateDevice = async () => {
    if (selectedDevice) {
      setErrorUpdateDevice({ device_id: '', name: '', brand: '', model: '' }); // Clear previous errors

      try {
        const response = await axios.post('http://192.168.1.200/api/device/update', {
          id: selectedDevice.device_id,
          name: updatedDevice.name,
          brand: updatedDevice.brand,
          model: updatedDevice.model,
          userid: userId,
        });

        if (response.data.success) {
          // Handle success
          setDevices((prevDevice: any) =>
            prevDevice.map((device: any) =>
              device.device_id === selectedDevice.device_id ? { ...device, ...updatedDevice } : device
            )
          );
          setUpdateDeviceVisible(false);
          setSelectedDevice(null);
        } else if (response.data.validationError && Object.keys(response.data.validationError).length > 0) {
          setErrorUpdateDevice(response.data.validationError);
        }
        else {
          console.log(response.data)
          Alert.alert('Info', response.data.message);
        }
      } catch (error) {
        console.error('Error updating child:', error);
      }
    }
  }
  const handleDeleteDevice = async () => {
    if (selectedDevice) {
      try {
        const response = await axios.post('http://192.168.1.200/api/device/delete', {
          id: selectedDevice.device_id,
        });
        if (response.data.success) {
          setDevices(devices.filter((device) => device.device_id !== selectedDevice.device_id));
          setDeleteVisible(false);
          setSelectedDevice(null);
          Alert.alert('Success', response.data.message)
        } else {
          Alert.alert('Warning', response.data.message)
          console.error('Error deleting child:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting child:', error);
      }
    }
  }
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.device_id.includes(searchQuery)
  );
  const [newDevice, setNewDevice] = useState({ device_id: '', name: '', brand: '', model: '', created_at: '' });
  const [errorDevice, setErrorDevice] = useState({ device_id: '', name: '', brand: '', model: '' });
  const [updatedDevice, setUpdatedDevice] = useState({ device_id: '', name: '', brand: '', model: '' });
  const [errorUpdateDevice, setErrorUpdateDevice] = useState({ device_id: '', name: '', brand: '', model: '' });
  const handleInputChange = (field: keyof DeviceInfo, value: string) => {
    setNewDevice(prevState => ({
      ...prevState,
      [field]: value,
    }));
    setNewDevice(prevState => ({
      ...prevState,
      ['created_at']: formatDate(new Date()),
    }));
    setErrorDevice(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const handleUpdateChange = (field: keyof DeviceInfo, value: string) => {
    setUpdatedDevice(prevState => ({
      ...prevState,
      [field]: value,
    }));

    setErrorUpdateDevice(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  return (

    <SafeAreaView style={[{ flex: 1, padding: 16 }, { backgroundColor: currentTheme.background }]}>
      <Searchbar
        placeholder="Search Device ID"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ marginBottom: 16 }}
      />
    {filteredDevices.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>No Device found.</Text>
    ) : (
      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item.device_id}
        renderItem={({ item }) => (
          <View key={item.device_id} style={{ marginBottom: 8 }}>
            <Card
              style={styles.card}
              onPress={(event) =>
                handleMenuOpen(item.device_id, { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
              }
            >
              <Card.Title
                title={`Device ID: ${item.device_id}`}
                subtitle={`${item.name} | ${item.brand}`}
                left={(props) => <Avatar.Icon {...props} icon="chip" />}
              />
              <Card.Content>
                <Text>Tap for options</Text>
              </Card.Content>
            </Card>

            {/* Options Menu */}
            <Menu
              visible={deviceOptionsVisible === item.device_id}
              onDismiss={handleMenuClose}
              anchor={{ x: menuAnchor?.x ?? 0, y: menuAnchor?.y ?? 0 }}
            >
              <Menu.Item onPress={() => handleMenuAction('view', item.device_id)} title="View" />
              <Menu.Item onPress={() => handleMenuAction('update', item.device_id)} title="Update" />
              <Divider />
              <Menu.Item onPress={() => handleMenuAction('delete', item.device_id)} title="Delete" />
            </Menu>
          </View>
        )}
      />
    )}

      {/* View Device Information */}
      <ViewDeviceInfoDialog visible={viewDeviceVisible} childId={selectedDevice?.device_id} onClose={() => setViewDeviceVisible(false)} />
      {/* Add Device Modal */}
      <Portal>
        <Dialog

          visible={addDeviceVisible}
          onDismiss={() => {
            setAddDeviceVisible(false);
            setNewDevice({ device_id: '', name: '', brand: '', model: '', created_at: '' });
            setErrorDevice({ device_id: '', name: '', brand: '', model: '' });
          }}>
          <Dialog.Title>Add Device Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="Device ID"
              value={newDevice.device_id}
              onChangeText={(text) => handleInputChange('device_id', text)}
              style={styles.input}
              error={!!errorDevice.device_id}
            />
            {errorDevice.device_id ? <Text style={styles.errorText}>{errorDevice.device_id}</Text> : null}
            <TextInput
              mode='outlined'
              label="Device Name"
              value={newDevice.name}
              onChangeText={(text) => handleInputChange('name', text)}
              style={styles.input}
              error={!!errorDevice.name}
            />
            {errorDevice.name ? <Text style={styles.errorText}>{errorDevice.name}</Text> : null}
            <TextInput
              mode='outlined'
              label="Device Brand"
              value={newDevice.brand}
              onChangeText={(text) => handleInputChange('brand', text)}
              style={styles.input}
              error={!!errorDevice.brand}
            />
            {errorDevice.brand ? <Text style={styles.errorText}>{errorDevice.brand}</Text> : null}
            <TextInput
              mode='outlined'
              label="Device Model"
              value={newDevice.model}
              onChangeText={(text) => handleInputChange('model', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errorDevice.model}
            />
            {errorDevice.model ? <Text style={styles.errorText}>{errorDevice.model}</Text> : null}

          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setAddDeviceVisible(false);
              setNewDevice({ device_id: '', name: '', brand: '', model: '', created_at: '' });
              setErrorDevice({ device_id: '', name: '', brand: '', model: '' });
            }}>Cancel</Button>
            <Button onPress={handleAddDevice}>Save Data</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>

      {/* Update Device Modal */}
      <Portal>
        <Dialog

          visible={updateDeviceVisible}
          onDismiss={() => {
            setUpdateDeviceVisible(false);
            setUpdatedDevice({ device_id: '', name: '', brand: '', model: '' });
            setErrorUpdateDevice({ device_id: '', name: '', brand: '', model: '' });
          }}>
          <Dialog.Title>Update Device Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="Device ID (Read-Only)"
              value={updatedDevice.device_id}
              onChangeText={(text) => handleUpdateChange('device_id', text)}
              style={styles.input}
              error={!!errorUpdateDevice.device_id}
              readOnly={true}
            />
            <TextInput
              mode='outlined'
              label="Device Name"
              value={updatedDevice.name}
              onChangeText={(text) => handleUpdateChange('name', text)}
              style={styles.input}
              error={!!errorUpdateDevice.name}
            />
            {errorUpdateDevice.name ? <Text style={styles.errorText}>{errorUpdateDevice.name}</Text> : null}
            <TextInput
              mode='outlined'
              label="Device Brand"
              value={updatedDevice.brand}
              onChangeText={(text) => handleUpdateChange('brand', text)}
              style={styles.input}
              error={!!errorUpdateDevice.brand}
            />
            {errorUpdateDevice.brand ? <Text style={styles.errorText}>{errorUpdateDevice.brand}</Text> : null}
            <TextInput
              mode='outlined'
              label="Device Model"
              value={updatedDevice.model}
              onChangeText={(text) => handleUpdateChange('model', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errorUpdateDevice.model}
            />
            {errorUpdateDevice.model ? <Text style={styles.errorText}>{errorUpdateDevice.model}</Text> : null}

          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setUpdateDeviceVisible(false);
              setUpdatedDevice({ device_id: '', name: '', brand: '', model: '' });
              setErrorUpdateDevice({ device_id: '', name: '', brand: '', model: '' });
            }}>Cancel</Button>
            <Button onPress={handleUpdateDevice}>Update Device</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          onDismiss={() => setDeleteVisible(false)}
          visible={visibleDelete}
        >
          <Dialog.Icon icon="alert" />
          <Dialog.Title className='text-center'>Delete Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to remove Device ID: {selectedDevice?.device_id}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setDeleteVisible(false);
                handleDeleteDevice();
              }}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* FAB Group */}
      <FAB.Group
        open={open}
        icon={open ? 'minus' : 'plus'}
        actions={[
          { icon: 'plus', label: 'Add Device', onPress: () => setAddDeviceVisible(true) },
        ]}
        onStateChange={({ open }: { open: boolean }) => setOpen(open)}
        visible={true}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
      />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 16,
  },
  card: {
    margin: 4,
    padding: 10,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  childContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  childName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  childDescription: {
    fontSize: 14,
    color: '#555',
  },

});

export default Devices;
