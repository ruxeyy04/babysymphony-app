import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, FAB, Portal, Menu, TouchableRipple, Divider, Modal, Button, TextInput, Provider as PaperProvider, Avatar, Text, Dialog } from 'react-native-paper';
import { useTheme } from '@/hooks/useAppTheme';
import { Dropdown } from 'react-native-paper-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewChildInfoDialog from "@/components/ViewBabyInfoDialog";
import DeviceSelectionDialog from '@/components/DeviceSelectionDialog';
import { useUserContext } from '@/context/UserContext';

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
const OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];
interface Child {
  id: number;
  name: string;
  fname: string;
  mname: string;
  lname: string;
  age: number;
  gender: string;
  deviceId: string | null;
}

interface ChildInfo {
  fname: string;
  mname: string;
  lname: string;
  age: string;
  gender: string;
}
const Child = () => {
  const {fetchBaby} = useUserContext()
  const [userId, setUserId] = useState<string | null>(null);
  const [visibleDelete, setDeleteVisible] = useState(false);
  const [removeAssignVisible, setRemoveAssignVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [updatedChild, setUpdatedChild] = useState({ fname: '', mname: '', lname: '', age: '', gender: '' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [addChildVisible, setAddChildVisible] = useState<boolean>(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [newChild, setNewChild] = useState({ fname: '', mname: '', lname: '', age: '', gender: '' });
  const [errorChild, setErrorChild] = useState({ fname: '', lname: '', age: '', gender: '' });
  const [errorUpdateChild, setErrorUpdateChild] = useState({
    fname: '',
    lname: '',
    age: '',
    gender: '',
  });
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
          fetchChildren(id)
        }
      } catch (error) {
        console.error('Failed to load user ID:', error);
      }
    };


    fetchUserId();
  }, []);
  const fetchChildren = async (userId: string) => {
    try {
      const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/baby/get?userid=${userId}`);
      if (response.data.success) {
        const formattedChildren = response.data.data.map((child: any) => ({
          id: child.id,
          fname: child.fname,
          mname: child.mname,
          lname: child.lname,
          name: `${child.fname} ${child.lname}`,
          age: child.months,
          info: child.gender,
          gender: child.gender,
          deviceId: child.device_id,
        }));
        setChildren(formattedChildren);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };
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



  const [visibleView, setVisibleView] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredChildren = children.filter((child) =>
    `${child.fname} ${child.lname}`.toLowerCase().includes(searchQuery.toLowerCase())
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
    const child = children.find((c) => c.id === childId);
    switch (action) {
      case 'view':
        setSelectedChild(child as Child);
        console.log(`View information for child ID: ${childId}`);
        setVisibleView(true);
        break;
      case 'update':
        if (child) {
          console.log(child)
          setSelectedChild(child);
          setUpdatedChild(child as any);
          setVisibleUpdate(true);
        }
        break;
      case 'delete':
        if (child) {
          setSelectedChild(child);
          setDeleteVisible(true);
        }
        break;
      case 'assign':
        if (child) {
          setSelectedChild(child);
          setAssignVisible(true);
          console.log(`Assigning Device for child ID: ${childId}`);
        }
        break;
      case 'remove':
        if (child) {
          setSelectedChild(child);
          setRemoveAssignVisible(true);
          console.log(`Removing Device for child ID: ${childId}`);
        }
        break;
      default:
        break;
    }
    handleMenuClose();
  };
  const handleDeleteBaby = async () => {
    if (selectedChild) {
      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/delete', {
          id: selectedChild.id,
        });
        if (response.data.success) {
          setChildren(children.filter((child) => child.id !== selectedChild.id));
          setDeleteVisible(false);
          setSelectedChild(null);
          console.log('Child deleted successfully');
          fetchBaby(userId as string)
        } else {
          console.error('Error deleting child:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting child:', error);
      }
    }
  };
  const handleUpdateChild = async () => {
    if (selectedChild) {
      setErrorUpdateChild({ fname: '', lname: '', age: '', gender: '' }); // Clear previous errors

      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/update', {
          id: selectedChild.id,
          fname: updatedChild.fname,
          mname: updatedChild.mname,
          lname: updatedChild.lname,
          age: updatedChild.age,
          gender: updatedChild.gender,
          userid: userId,
        });

        if (response.data.success) {
          // Handle success
          setChildren((prevChildren: any) =>
            prevChildren.map((child: any) =>
              child.id === selectedChild.id ? { ...child, ...updatedChild } : child
            )
          );
          fetchBaby(userId as string)
          setVisibleUpdate(false);
          setSelectedChild(null);
        } else if (response.data.validationError && Object.keys(response.data.validationError).length > 0) {
          setErrorUpdateChild(response.data.validationError);
        }
        else {
          Alert.alert('Info', response.data.message);
        }
      } catch (error) {
        console.error('Error updating child:', error);
      }
    }
  };
  const handleRemoveAssignDevice = async () => {
    if (selectedChild) {
        console.log(`Removing device assignment for child ID: ${selectedChild.id}`);

        try {
            const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/removeassign.php', {
                baby_id: selectedChild.id,
            });

            if (response.data.success) {
                Alert.alert('Success', response.data.message)
                fetchChildren(userId as any)
            } else {
                console.warn('Error removing device assignment:', response.data.message);
            }
        } catch (error) {
            console.error('Error during removal of device assignment:', error);
        }
    } else {
        console.warn("No child selected for device unassignment");
    }
};



  const handleAddChild = async () => {
    // Clear previous errors
    setErrorChild({ fname: '', lname: '', age: '', gender: '' });

    // Validate input fields
    let valid = true;
    if (!newChild.fname) {
      setErrorChild((prev) => ({ ...prev, fname: 'First Name is required.' }));
      valid = false;
    }
    if (!newChild.lname) {
      setErrorChild((prev) => ({ ...prev, lname: 'Last Name is required.' }));
      valid = false;
    }
    if (!newChild.gender) {
      setErrorChild((prev) => ({ ...prev, gender: 'Gender is required.' }));
      valid = false;
    }
    const ageNumber = parseInt(newChild.age, 10);

    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 9) {
      setErrorChild((prev) => ({ ...prev, age: 'Age must be between 0 and 9 months.' }));
      valid = false;
    }

    if (valid) {
      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/add', {
          fname: newChild.fname,
          mname: newChild.mname,
          lname: newChild.lname,
          gender: newChild.gender,
          months: newChild.age,
          userid: userId,
        });

        if (response.data.success) {
          alert(response.data.message);
          setNewChild({ fname: '', mname: '', lname: '', age: '', gender: '' });
          fetchChildren(userId as any)
          setAddChildVisible(false);
          fetchBaby(userId as string)
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(error);
        alert('There was an error adding the child. Please try again later.');
      }
    }
  };

  const handleInputChange = (field: keyof ChildInfo, value: string) => {
    setNewChild(prevState => ({
      ...prevState,
      [field]: value,
    }));

    setErrorChild(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const handleUpdateInputChange = (field: keyof ChildInfo, value: string) => {
    setUpdatedChild(prevState => ({
      ...prevState,
      [field]: value,
    }));

    setErrorUpdateChild(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  return (
    <>
      <ViewChildInfoDialog visible={visibleView} childId={selectedChild?.id} onClose={() => setVisibleView(false)} />
      <DeviceSelectionDialog
        visible={assignVisible}
        onClose={() => setAssignVisible(false)}
        childId={selectedChild?.id}
        userID={userId}
        fetchChildren={fetchChildren}
      />
      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          onDismiss={() => setDeleteVisible(false)}
          visible={visibleDelete}
        >
          <Dialog.Icon icon="alert" />
          <Dialog.Title className='text-center'>Delete Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to remove {selectedChild?.name}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setDeleteVisible(false);
                handleDeleteBaby();
              }}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* Remove Assign Device Confirmation Dialog */}
      <Portal>
        <Dialog
          onDismiss={() => setRemoveAssignVisible(false)}
          visible={removeAssignVisible}
        >
          <Dialog.Icon icon="alert" />
          <Dialog.Title className='text-center'>Delete Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to remove the assigned device of {selectedChild?.name}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRemoveAssignVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setRemoveAssignVisible(false);
                handleRemoveAssignDevice();
              }}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <SafeAreaView style={[{ flex: 1, padding: 16 }, { backgroundColor: currentTheme.background }]}>

        {/* Search Bar */}

        <Searchbar
          placeholder="Search Baby"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />

        {/* Child List */}
        <ScrollView style={{ flex: 1 }}>
          {filteredChildren.map((child) => (
            <View key={child.id} style={{ marginBottom: 8 }}>
              <Card
                className='m-[4px] p-[10px]'
                onPress={(event) =>
                  handleMenuOpen(child.id, {
                    x: event.nativeEvent.pageX,
                    y: event.nativeEvent.pageY,
                  })
                }
              >
                <Card.Title
                  title={`${child.fname} ${child.lname}`}
                  subtitle={`Age: ${child.age} months | Device ID: ${child.deviceId ?? 'None'}`}
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
                {child.deviceId ? (
                  <Menu.Item onPress={() => handleMenuAction('remove', child.id)} title="Remove Device" />
                ) : (
                  <Menu.Item onPress={() => handleMenuAction('assign', child.id)} title="Assign Device" />
                )}
                <Divider />
                <Menu.Item onPress={() => handleMenuAction('delete', child.id)} title="Delete" />
              </Menu>
            </View>
          ))}
          {filteredChildren.length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No children found.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Add Child Modal */}
      <Portal>
        <Dialog

          visible={addChildVisible}
          onDismiss={() => {
            setAddChildVisible(false);
            setNewChild({ fname: '', mname: '', lname: '', age: '', gender: '' });
            setErrorChild({ fname: '', lname: '', age: '', gender: '' });
          }}>
          <Dialog.Title>Add Baby Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="First Name"
              value={newChild.fname}
              onChangeText={(text) => handleInputChange('fname', text)}
              style={styles.input}
              error={!!errorChild.fname}
            />
            {errorChild.fname ? <Text style={styles.errorText}>{errorChild.fname}</Text> : null}
            <TextInput
              mode='outlined'
              label="Middle Name"
              value={newChild.mname}
              onChangeText={(text) => handleInputChange('mname', text)}
              style={styles.input}
            />
            <TextInput
              mode='outlined'
              label="Last Name"
              value={newChild.lname}
              onChangeText={(text) => handleInputChange('lname', text)}
              style={styles.input}
              error={!!errorChild.lname}
            />
            {errorChild.lname ? <Text style={styles.errorText}>{errorChild.lname}</Text> : null}
            <TextInput
              mode='outlined'
              label="Age (0 - 9 Months)"
              value={newChild.age}
              onChangeText={(text) => handleInputChange('age', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errorChild.age}
            />
            {errorChild.age ? <Text style={styles.errorText}>{errorChild.age}</Text> : null}
            <Dropdown
              mode="outlined"
              label="Gender"
              placeholder="Select Gender"
              options={OPTIONS}
              value={newChild.gender || ''}
              onSelect={(text) => handleInputChange('gender', text as string)}
              error={!!errorChild.gender}
            />
            {errorChild.gender ? <Text style={styles.errorText}>{errorChild.gender}</Text> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setAddChildVisible(false);
              setNewChild({ fname: '', mname: '', lname: '', age: '', gender: '' });
              setErrorChild({ fname: '', lname: '', age: '', gender: '' });
            }}>Cancel</Button>
            <Button onPress={handleAddChild}>Save Data</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
      {/* Update Child Modal */}
      <Portal>
        <Dialog
          visible={visibleUpdate}
          onDismiss={() => {
            setVisibleUpdate(false);
            setUpdatedChild({ fname: '', mname: '', lname: '', age: '', gender: '' });
            setErrorUpdateChild({ fname: '', lname: '', age: '', gender: '' });
          }}
        >
          <Dialog.Title>Update Baby Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="First Name"
              value={updatedChild.fname || ''}
              onChangeText={(text) => handleUpdateInputChange('fname', text)}
              style={styles.input}
              error={!!errorUpdateChild.fname}
            />
            {errorUpdateChild.fname ? <Text style={styles.errorText}>{errorUpdateChild.fname}</Text> : null}

            <TextInput
              mode='outlined'
              label="Middle Name"
              value={updatedChild.mname || ''}
              onChangeText={(text) => handleUpdateInputChange('mname', text)}
              style={styles.input}
            />

            <TextInput
              mode='outlined'
              label="Last Name"
              value={updatedChild.lname || ''}
              onChangeText={(text) => handleUpdateInputChange('lname', text)}
              style={styles.input}
              error={!!errorUpdateChild.lname}
            />
            {errorUpdateChild.lname ? <Text style={styles.errorText}>{errorUpdateChild.lname}</Text> : null}

            <TextInput
              mode='outlined'
              label="Age (0 - 9 Months)"
              value={String(updatedChild.age || '')}
              onChangeText={(text) => handleUpdateInputChange('age', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errorUpdateChild.age}
            />
            {errorUpdateChild.age ? <Text style={styles.errorText}>{errorUpdateChild.age}</Text> : null}

            <Dropdown
              mode="outlined"
              label="Gender"
              placeholder="Select Gender"
              options={OPTIONS}
              value={updatedChild.gender || ''}
              onSelect={(text) => handleUpdateInputChange('gender', text as string)}
              error={!!errorUpdateChild.gender}
            />
            {errorUpdateChild.gender ? <Text style={styles.errorText}>{errorUpdateChild.gender}</Text> : null}
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => {
              setVisibleUpdate(false);
              setUpdatedChild({ fname: '', mname: '', lname: '', age: '', gender: '' });
              setErrorUpdateChild({ fname: '', lname: '', age: '', gender: '' });
            }}>Cancel</Button>
            <Button onPress={handleUpdateChild}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* FAB Group */}
      <FAB.Group
        open={open}
        icon={open ? 'minus' : 'plus'}
        actions={[
          { icon: 'plus', label: 'Add Baby', onPress: () => setAddChildVisible(true) },
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
  errorText: {
    color: '#b3271c',
    fontSize: 12,
    marginBottom: 8,
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
