import { useTheme } from '@/hooks/useAppTheme';
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, useColorScheme } from 'react-native';
import { Avatar, Button, Card, FAB, Modal, PaperProvider, Paragraph, TextInput, Menu, Divider, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        
  const [open, setOpen] = useState<boolean>(false);
  const [addDeviceVisible, setAddDeviceVisible] = useState<boolean>(false);
  const [viewChildrenVisible, setViewChildrenVisible] = useState<boolean>(false);
  const [deviceOptionsVisible, setDeviceOptionsVisible] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedDeviceChildren, setSelectedDeviceChildren] = useState<string[]>([]);

  const [devices, setDevices] = useState([
    { id: 1, deviceId: '2338984', name: 'Device 1', description: 'Main device', children: ['Child 1', 'Child 2'] },
    { id: 2, deviceId: '7684321', name: 'Device 2', description: 'Secondary device', children: ['Child 3'] },
  ]);

  const handleMenuOpen = (id: number, anchor: { x: number; y: number }) => {
    setMenuAnchor(anchor);
    setDeviceOptionsVisible(id);
  };

  const handleMenuClose = () => {
    setDeviceOptionsVisible(null);
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: string, deviceId: number) => {
    const selectedDevice = devices.find((device) => device.id === deviceId);
    switch (action) {
      case 'view':
        if (selectedDevice) {
          setSelectedDeviceChildren(selectedDevice.children);
          setViewChildrenVisible(true);
        }
        break;
      case 'update':
        console.log(`Update device ID: ${deviceId}`);
        break;
      case 'delete':
        console.log(`Delete device ID: ${deviceId}`);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  const handleAddDevice = () => {
    if (!newDeviceId || !newDeviceName) {
      setError('Please enter both a valid device ID and device name.');
      return;
    }

    // Check that the device ID is a 7-digit number
    if (!/^\d{7}$/.test(newDeviceId)) {
      setError('Device ID must be a 7-digit number.');
      return;
    }

    // Check that the device name is at least 3 characters long
    if (newDeviceName.length < 3) {
      setError('Device name must be at least 3 characters long.');
      return;
    }

    // Add the new device to the devices list
    setDevices([
      ...devices,
      {
        id: devices.length + 1,
        deviceId: newDeviceId,
        name: newDeviceName,
        description: 'Added device',
        children: [],
      },
    ]);

    // Reset the input fields and close the modal
    setNewDeviceId('');
    setNewDeviceName('');
    setError('');
    setAddDeviceVisible(false);
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceId.includes(searchQuery)
  );

  return (

    <SafeAreaView style={[ {flex: 1, padding: 16 }, { backgroundColor: currentTheme.background }]}>
      <Searchbar
        placeholder="Search Device ID"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={{ marginBottom: 8 }}>
            <Card
              style={styles.card}
              onPress={(event) =>
                handleMenuOpen(item.id, { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
              }
            >
              <Card.Title
                title={`Device ID: ${item.deviceId}`}
                subtitle={item.description}
                left={(props) => <Avatar.Icon {...props} icon="chip" />}
              />
              <Card.Content>
                <Text>Tap for options</Text>
              </Card.Content>
            </Card>

            {/* Options Menu */}
            <Menu
              visible={deviceOptionsVisible === item.id}
              onDismiss={handleMenuClose}
              anchor={{ x: menuAnchor?.x ?? 0, y: menuAnchor?.y ?? 0 }}
            >
              <Menu.Item onPress={() => handleMenuAction('view', item.id)} title="View" />
              <Menu.Item onPress={() => handleMenuAction('update', item.id)} title="Update" />
              <Divider />
              <Menu.Item onPress={() => handleMenuAction('delete', item.id)} title="Delete" />
            </Menu>
          </View>
        )}
      />

      {/* View Children Modal */}
      <Modal visible={viewChildrenVisible} onDismiss={() => setViewChildrenVisible(false)} contentContainerStyle={styles.modalContainer}>
        <Paragraph style={styles.modalTitle}>Children Associated with Device</Paragraph>
        {selectedDeviceChildren.length > 0 ? (
          selectedDeviceChildren.map((child, index) => (
            <View key={index} style={styles.childContainer}>
              <Paragraph style={styles.childName}>Ruxe Pasok</Paragraph>
              <Paragraph style={styles.childDescription}>Age: 0-8 months</Paragraph>
            </View>
          ))
        ) : (
          <Paragraph>No children associated with this device.</Paragraph>
        )}
        <Button mode="contained" onPress={() => setViewChildrenVisible(false)} style={styles.closeButton}>
          Close
        </Button>
      </Modal>


      {/* Add Device Modal */}
      <Modal visible={addDeviceVisible} onDismiss={() => setAddDeviceVisible(false)} contentContainerStyle={styles.modalContainer}>
        <TextInput
          label="Device ID"
          value={newDeviceId}
          onChangeText={(text) => {
            setNewDeviceId(text);
            setError(''); // Clear error on input change
          }}
          style={styles.input}
          keyboardType="numeric"
          error={!!error}
        />
        <TextInput
          label="Device Name"
          value={newDeviceName}
          onChangeText={(text) => {
            setNewDeviceName(text);
            setError(''); // Clear error on input change
          }}
          style={styles.input}
          error={!!error && error.includes('Device name')}
        />
        {error ? <Paragraph style={styles.errorText}>{error}</Paragraph> : null}
        <Button mode="contained" onPress={handleAddDevice} style={styles.button}>
          Add Device
        </Button>
      </Modal>



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
