import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, FAB, Portal, Menu, TouchableRipple, Divider, Modal, Button, TextInput, Provider as PaperProvider, Avatar, Text, Dialog } from 'react-native-paper';
import { useTheme } from '@/hooks/useAppTheme';
import { Dropdown } from 'react-native-paper-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewChildInfoDialog from "@/components/ViewBabyInfoDialog";
import DeviceSelectionDialog from '@/components/DeviceSelectionDialog';
import { useUserContext } from '@/context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  nickname: string;
  age: number;
  gender: string;
  deviceId: string | null;
}

interface ChildInfo {
  nickname: string;
  age: string;
  gender: string;
}
const Child = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEditDate, setSelectedEditDate] = useState<Date | undefined>(undefined);
  const [ageInMonths, setAgeInMonths] = useState<number>(0);
  const [ageEditInMonths, setAgeEditInMonths] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const currentDate = new Date();
  const calculateAgeInMonths = (birthDate: Date): number => {

    const birth = new Date(birthDate);

    let ageInMonths = currentDate.getMonth() - birth.getMonth();
    const yearsDifference = currentDate.getFullYear() - birth.getFullYear();

    if (ageInMonths < 0) {
      ageInMonths += 12;
    }
    ageInMonths += yearsDifference * 12;
    return ageInMonths;
  };
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Strip the time component and adjust for local time zone
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0); // Remove the time

      console.log(dateOnly.toISOString().split('T')[0]); // Logs only the date in YYYY-MM-DD format
      setSelectedDate(dateOnly);

      const age = calculateAgeInMonths(dateOnly);
      setAgeInMonths(age);
    }
  };
  const onUpdateDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Strip the time component and adjust for local time zone
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0); // Remove the time

      console.log(dateOnly.toISOString().split('T')[0]); // Logs only the date in YYYY-MM-DD format
      setSelectedEditDate(dateOnly);

      const age = calculateAgeInMonths(dateOnly);
      setAgeEditInMonths(age);
    }
  };
  const { fetchBaby } = useUserContext()
  const [userId, setUserId] = useState<string | null>(null);
  const [visibleDelete, setDeleteVisible] = useState(false);
  const [removeAssignVisible, setRemoveAssignVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [updatedChild, setUpdatedChild] = useState({ nickname: '', age: '', gender: '' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [addChildVisible, setAddChildVisible] = useState<boolean>(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [newChild, setNewChild] = useState({ nickname: '', age: '', gender: '' });
  const [errorChild, setErrorChild] = useState({ nickname: '', age: '', gender: '' });
  const [errorUpdateChild, setErrorUpdateChild] = useState({
    nickname: '',
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
          nickname: child.nickname,
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
    `${child.nickname}`.toLowerCase().includes(searchQuery.toLowerCase())
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
          fetchChildData(child.id);
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
  // Function to fetch child data and update the birthdate
  const fetchChildData = async (childId: number) => {
    try {
      const response = await axios.get(`https://maide-deeplearning.bsit-ln.com/api/baby/getspecific?id=${childId}`);
      if (response.data && response.data.data && response.data.data.baby) {
        const birthdate = new Date(response.data.data.baby.birthdate)
        const babyAgeMonths = response.data.data.baby.months
        if (birthdate) {
          // Store the birthdate
          console.log('Fetched Birthdate:', birthdate);
          setSelectedEditDate(birthdate); // Set the fetched birthdate
          setAgeEditInMonths(babyAgeMonths)
        }
      } else {
        console.error('Error: Baby data not found in response');
      }
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
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
      setErrorUpdateChild({ nickname: '', age: '', gender: '' }); // Clear previous errors

      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/update', {
          id: selectedChild.id,
          nickname: updatedChild.nickname,
          age: ageEditInMonths,
          birthdate: selectedEditDate,
          gender: updatedChild.gender,
          userid: userId,
        });

        if (response.data.success) {
          await fetchChildren(`${userId}`);
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
    setErrorChild({ nickname: '', age: '', gender: '' });

    // Validate input fields
    let valid = true;
    if (!newChild.nickname) {
      setErrorChild((prev) => ({ ...prev, nickname: 'Nickname is required.' }));
      valid = false;
    }
    if (!newChild.gender) {
      setErrorChild((prev) => ({ ...prev, gender: 'Gender is required.' }));
      valid = false;
    }
    const ageNumber = ageInMonths;
    console.log(ageNumber)
    if (isNaN(ageNumber) || ageNumber <= -1 || ageNumber > 8) {
      setErrorChild((prev) => ({ ...prev, age: 'Age must be between 0 and 8 months.' }));
      valid = false;
    }

    if (valid) {
      try {
        const response = await axios.post('https://maide-deeplearning.bsit-ln.com/api/baby/add', {
          nickname: newChild.nickname,
          gender: newChild.gender,
          months: ageInMonths,
          userid: userId,
          birthdate: selectedDate
        });

        if (response.data.success) {
          alert(response.data.message);
          setNewChild({ nickname: '', age: '', gender: '' });
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
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChildren(`${userId}`); // Replace with actual userId
    setRefreshing(false);
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
            <Text>Are you sure you want to remove {selectedChild?.nickname}?</Text>
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
            <Text>Are you sure you want to remove the assigned device of {selectedChild?.nickname}?</Text>
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
        <ScrollView style={{ flex: 1 }} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
                  title={`${child.nickname}`}
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
            setNewChild({ nickname: '', age: '', gender: '' });
            setErrorChild({ nickname: '', age: '', gender: '' });
            setSelectedDate(new Date())
            setAgeInMonths(0)
          }}
        >
          <Dialog.Title>Add Baby Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="Nickname"
              value={newChild.nickname}
              onChangeText={(text) => handleInputChange('nickname', text)}
              style={styles.input}
              error={!!errorChild.nickname}
            />
            {errorChild.nickname ? <Text style={styles.errorText}>{errorChild.nickname}</Text> : null}



            <TextInput
              mode='outlined'
              label="Age (0 - 8 Months)"
              value={ageInMonths.toString()}
              style={styles.input}
              editable={false}
            />
            <Button mode="contained" onPress={showDatepicker} style={styles.buttonDatePicker}>
              Select Birthdate
            </Button>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate || new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}
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
              setNewChild({ nickname: '', age: '', gender: '' });
              setErrorChild({ nickname: '', age: '', gender: '' });
              setSelectedDate(new Date())
              setAgeInMonths(0)
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
            setUpdatedChild({ nickname: '', age: '', gender: '' });
            setErrorUpdateChild({ nickname: '', age: '', gender: '' });
          }}
        >
          <Dialog.Title>Update Baby Information</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode='outlined'
              label="Nickname"
              value={updatedChild.nickname || ''}
              onChangeText={(text) => handleUpdateInputChange('nickname', text)}
              style={styles.input}
              error={!!errorUpdateChild.nickname}
            />
            {errorUpdateChild.nickname ? <Text style={styles.errorText}>{errorUpdateChild.nickname}</Text> : null}

            <TextInput
              mode='outlined'
              label="Age (0 - 8 Months)"
              value={String(ageEditInMonths || '')}
              onChangeText={(text) => handleUpdateInputChange('age', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errorUpdateChild.age}
            />
            {errorUpdateChild.age ? <Text style={styles.errorText}>{errorUpdateChild.age}</Text> : null}
            <Button mode="contained" onPress={showDatepicker} style={styles.buttonDatePicker}>
              Select Birthdate
            </Button>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedEditDate || new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onUpdateDateChange}
              />
            )}
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
              setUpdatedChild({ nickname: '', age: '', gender: '' });
              setErrorUpdateChild({ nickname: '', age: '', gender: '' });
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
  buttonDatePicker: {
    marginHorizontal: 5, // Add horizontal spacing between buttons
    marginVertical: 5, // Add vertical spacing for wrapped buttons
  },
});

export default Child;
