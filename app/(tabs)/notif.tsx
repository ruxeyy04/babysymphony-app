import React, { useState } from "react";
import { View, StyleSheet, FlatList, Alert, useColorScheme, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Text, Button, Searchbar, Menu } from "react-native-paper";
import { useTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { useTabNavigation } from "@/context/TabNavigationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNoteDialog from "@/components/AddNoteDialog";
import ViewNoteDialog from "@/components/ViewNoteDialog";
import DeleteNoteDialog from "@/components/DeleteNoteDialog";

const themes = {
  light: { background: "#EFF8FF", appbar: "#D2EBFF", textColor: "#2D2D2D" },
  dark: { background: "#1B1B1F", appbar: "#282831", textColor: "#D7E0F9" },
};

const Notif = () => {
  const { setIndex } = useTabNavigation();  // Use the context here

  const [userId, setUserId] = useState<string | null>(null);
  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
        }
      } catch (error) {
        console.error('Failed to load user ID:', error);
      }
    };


    fetchUserId();
  }, []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { notifications, acknowledgeNotification, deleteNotif, loadNotifications } = useUserContext();
  const { theme } = useTheme();
  const deviceColorScheme = useColorScheme();

  const uniqueNotifications = notifications.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
  );

  const filteredNotifications = uniqueNotifications.filter((notification) => {
    const titleMatches = notification.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const createdAtMatches = notification.created_at
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return titleMatches || createdAtMatches;
  });


  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
        ? themes.dark
        : themes.light;

  // Function to confirm and delete a notification
  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => { deleteNotif(id); loadNotifications },
        },
      ]
    );
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    loadNotifications()
    setRefreshing(false);
  };
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [viewNoteVisible, setViewNoteVisible] = useState(false);
  const [deleteNoteVisible, setDeleteNoteVisible] = useState(false);
  const [selectedNotifId, setSelectedNotifId] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const openAddNoteDialog = (notifId: any) => {
    setSelectedNotifId(notifId);
    setAddNoteVisible(true);
  };

  const openViewNoteDialog = (notifId: any) => {
    setSelectedNotifId(notifId);
    setViewNoteVisible(true);
  };

  const openDeleteNoteDialog = (noteId: any) => {
    setSelectedNoteId(noteId);
    setDeleteNoteVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Searchbar
        placeholder="Search Notifications"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {filteredNotifications.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No Notification Yet.
        </Text>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}
            onLongPress={() => confirmDelete(item.id)}
            >
              <Card.Content>
                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.date}>
                  {item.acknowledge_by == null ? 'Not Yet Acknowledge' : `Acknowledged by: ${item.acknowledge_by}`} | {item.created_at}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <View style={styles.buttonContainer}>
                  {/* Acknowledge Button */}
                  {item.acknowledge === 0 && item.notif_owner == userId && item.shared_by.length === 0 && (
                    <Button
                      mode="contained"
                      onPress={() => { acknowledgeNotification(item.id, userId) }}
                      style={styles.button}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {item.acknowledge === 0 && item.shared_by.length != 0 && item.shared_by.includes(Number(userId)) && (
                    <Button
                      mode="contained"
                      onPress={() => { acknowledgeNotification(item.id, userId) }}
                      style={styles.button}
                    >
                      Acknowledge
                    </Button>
                  )}

                  {/* Add Note Button */}
                  {item.is_shared === "No" && (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => openAddNoteDialog(item.id)}
                        style={styles.button}
                      >
                        Add Note
                      </Button>
                      {item.note_status !== "No" && (
                        <Button
                          mode="outlined"
                          onPress={() => openDeleteNoteDialog(item.id)}
                          style={styles.button}
                        >
                          Delete Note
                        </Button>
                      )}
                    </>
                  )}

                  {/* View Note Button */}
                  {item.note_status === "Yes" && (
                    <Button
                      mode="outlined"
                      onPress={() => openViewNoteDialog(item.id)}
                      style={styles.button}
                    >
                      View Note
                    </Button>
                  )}
                </View>
              </Card.Actions>

            </Card>
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

      )}
      <AddNoteDialog
        visible={addNoteVisible}
        notifId={selectedNotifId}
        userId="8"
        onClose={() => setAddNoteVisible(false)}
        onNoteAdded={onRefresh} // Reload data on note addition
      />
      <ViewNoteDialog
        visible={viewNoteVisible}
        notifId={selectedNotifId}
        onClose={() => setViewNoteVisible(false)}
      />
      <DeleteNoteDialog
        visible={deleteNoteVisible}
        noteId={selectedNoteId}
        onClose={() => setDeleteNoteVisible(false)}
        onDelete={onRefresh} // Reload data on note deletion
      />

    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: { marginBottom: 16 },
  list: { paddingBottom: 16 },
  card: { marginBottom: 16, borderRadius: 8, elevation: 3 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  date: { fontSize: 12, color: "#999999", marginBottom: 8 },


  actions: {
    justifyContent: 'flex-start', // Align buttons to the start of the card
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    flexWrap: 'wrap', // Allow buttons to wrap to the next line if necessary
    gap: 10, // Add space between buttons
  },
  button: {
    marginHorizontal: 5, // Add horizontal spacing between buttons
    marginVertical: 5, // Add vertical spacing for wrapped buttons
  },
});

export default Notif;
