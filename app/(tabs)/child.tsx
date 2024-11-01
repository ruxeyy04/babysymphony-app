import React, { useState } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, FAB, Portal, Menu, TouchableRipple, Divider, Modal, Button, TextInput, Provider as PaperProvider, Avatar, Text } from 'react-native-paper';
import { useTheme } from '@/hooks/useAppTheme';

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
const Child = () => {
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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [addChildVisible, setAddChildVisible] = useState<boolean>(false);
  const [children, setChildren] = useState([
    { id: 1, name: 'John Doe', age: 5, info: 'Kindergarten', deviceId: 'D001' },
    { id: 2, name: 'Jane Doe', age: 3, info: 'Pre-school', deviceId: 'D002' },
  ]);
  const [newChild, setNewChild] = useState({ name: '', age: '', info: '', deviceId: '' });

  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (id: number, anchor: { x: number; y: number }) => {
    setMenuAnchor(anchor);
    setVisibleMenu(id);
  };

  const handleMenuClose = () => {
    setVisibleMenu(null);
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: string, childId: number) => {
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
    handleMenuClose();
  };

  const handleAddChild = () => {
    if (newChild.name && newChild.age && newChild.deviceId) {
      setNewChild({ name: '', age: '', info: '', deviceId: '' });
      setAddChildVisible(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <>
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
              <Card
                onPress={(event) =>
                  handleMenuOpen(child.id, {
                    x: event.nativeEvent.pageX,
                    y: event.nativeEvent.pageY,
                  })
                }
              >
                <Card.Title
                  title={child.name}
                  subtitle={`Age: ${child.age} | ${child.info} | Device ID: ${child.deviceId}`}
                  left={(props) => <Avatar.Icon {...props} icon="account-child" />}
                />
                <Card.Content>
                  <Text>Tap for options</Text>
                </Card.Content>
              </Card>

              {/* Options Menu */}
              <Menu
                visible={visibleMenu === child.id}
                onDismiss={handleMenuClose}
                anchor={{ x: menuAnchor?.x ?? 0, y: menuAnchor?.y ?? 0 }}
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
      <Modal visible={addChildVisible} onDismiss={() => setAddChildVisible(false)} contentContainerStyle={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
        <TextInput
          mode='outlined'
          label="Name"
          value={newChild.name}
          onChangeText={(text) => setNewChild({ ...newChild, name: text })}
          style={styles.input}
        />
        <TextInput
          mode='outlined'
          label="Age"
          value={newChild.age}
          onChangeText={(text) => setNewChild({ ...newChild, age: text })}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          mode='outlined'
          label="Info"
          value={newChild.info}
          onChangeText={(text) => setNewChild({ ...newChild, info: text })}
          style={styles.input}
        />
        <TextInput
          mode='outlined'
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
        ]}
        onStateChange={({ open }: { open: boolean }) => setOpen(open)}
        visible={true}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
      />
    </>

  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
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
});

export default Child;
