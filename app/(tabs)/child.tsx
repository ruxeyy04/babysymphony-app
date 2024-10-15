import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, List, FAB, Portal, Menu, TouchableRipple, Divider, Modal, Button, TextInput, Provider as PaperProvider } from 'react-native-paper';

const Child = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null); // For showing options (update, delete, view)
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null); // For menu anchor position
  const [addChildVisible, setAddChildVisible] = useState<boolean>(false); // Modal visibility state for adding child

  const [children, setChildren] = useState([
    { id: 1, name: 'John Doe', age: 5, info: 'Kindergarten', deviceId: 'D001' },
    { id: 2, name: 'Jane Doe', age: 3, info: 'Pre-school', deviceId: 'D002' },
  ]);

  const [newChild, setNewChild] = useState({ name: '', age: '', info: '', deviceId: '' }); // State to manage new child data

  // Search function to filter child list
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (id: number, anchor: { x: number; y: number }) => {
    // Set the anchor position and open the menu
    setMenuAnchor(anchor);
    setVisibleMenu(id);
  };

  const handleMenuClose = () => {
    setVisibleMenu(null);
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: string, childId: number) => {
    // Handle the action for menu options
    switch (action) {
      case 'view':
        console.log(`View information for child ID: ${childId}`);
        break;
      case 'update':
        console.log(`Update information for child ID: ${childId}`);
        break;
      case 'delete':
        console.log(`Delete child ID: ${childId}`);
        break;
      default:
        break;
    }
    handleMenuClose(); // Close the menu after the action
  };

  const handleAddChild = () => {
    if (newChild.name && newChild.age && newChild.deviceId) {
      setNewChild({ name: '', age: '', info: '', deviceId: '' }); // Reset input fields
      setAddChildVisible(false); // Close modal
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search Child"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />

        {/* Child List */}
        <View style={{ flex: 1 }}>
          {filteredChildren.map((child) => (
            <View key={child.id} style={{ marginBottom: 8 }}>
              <TouchableRipple
                onPress={(event) => handleMenuOpen(child.id, { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })}
                rippleColor="rgba(0, 0, 0, 0.2)" // Ripple effect
                style={styles.rippleContainer} // Custom style for layout
              >
                <List.Item
                  title={child.name}
                  description={`Age: ${child.age} | ${child.info} | Device ID: ${child.deviceId}`}
                  left={() => <List.Icon icon="account-child" />}
                />
              </TouchableRipple>

              {/* Options Menu */}
              <Menu
                visible={visibleMenu === child.id}
                onDismiss={handleMenuClose}
                anchor={{ x: menuAnchor?.x ?? 0, y: menuAnchor?.y ?? 0 }} // Set the anchor for the menu
              >
                <Menu.Item onPress={() => handleMenuAction('view', child.id)} title="View" />
                <Menu.Item onPress={() => handleMenuAction('update', child.id)} title="Update" />
                <Divider />
                <Menu.Item onPress={() => handleMenuAction('delete', child.id)} title="Delete" />
              </Menu>
            </View>
          ))}
        </View>
      </SafeAreaView>

      {/* Add Child Modal */}
        <Modal visible={addChildVisible} onDismiss={() => setAddChildVisible(false)} contentContainerStyle={styles.modalContainer}>
          <TextInput
            label="Name"
            value={newChild.name}
            onChangeText={(text) => setNewChild({ ...newChild, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Age"
            value={newChild.age}
            onChangeText={(text) => setNewChild({ ...newChild, age: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Info"
            value={newChild.info}
            onChangeText={(text) => setNewChild({ ...newChild, info: text })}
            style={styles.input}
          />
          <TextInput
            label="Device ID"
            value={newChild.deviceId}
            onChangeText={(text) => setNewChild({ ...newChild, deviceId: text })}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleAddChild} style={styles.button}>
            Add Child
          </Button>
        </Modal>

      {/* FAB Group */}
      <FAB.Group
        open={open}
        icon={open ? 'minus' : 'plus'}
        actions={[
          { icon: 'plus', label: 'Add Child', onPress: () => setAddChildVisible(true) },
          { icon: 'plus', label: 'Add Device', onPress: () => { /* Add Device action */ } },
        ]}
        onStateChange={({ open }: { open: boolean }) => setOpen(open)}
        visible={true}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  rippleContainer: {
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#181818',
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default Child;
