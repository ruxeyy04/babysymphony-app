import React, { useState } from "react";
import { View, StyleSheet, FlatList, Alert, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Text, Button, Searchbar } from "react-native-paper";
import { useTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { useTabNavigation } from "@/context/TabNavigationContext";

const themes = {
  light: { background: "#EFF8FF", appbar: "#D2EBFF", textColor: "#2D2D2D" },
  dark: { background: "#1B1B1F", appbar: "#282831", textColor: "#D7E0F9" },
};

const Notif = () => {
  const { setIndex } = useTabNavigation();  // Use the context here

  const handleCardPress = () => {
    setIndex(2); // Change to the 'device' tab (index 2)
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { notifications, acknowledgeNotification, deleteNotif } = useUserContext();
  const { theme } = useTheme();
  const deviceColorScheme = useColorScheme();

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onPress: () => deleteNotif(id),
        },
      ]
    );
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
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No Notification Yet.</Text>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onLongPress={() => confirmDelete(item.id)} 
            >
              <Card.Content>
                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.date}>
                  {item.title} | {item.created_at}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                {item.acknowledge === 0 && (
                  <Button
                    mode="contained"
                    onPress={() => acknowledgeNotification(item.id)}
                    style={styles.button}
                  >
                    Acknowledge
                  </Button>
                )}
              </Card.Actions>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}
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
  actions: { justifyContent: "flex-end" },
  button: { borderRadius: 20 },
});

export default Notif;
