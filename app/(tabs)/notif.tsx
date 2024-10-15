import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, Provider, Searchbar } from 'react-native-paper';

// Sample notifications data with acknowledgment property
const sampleNotifications = [
  { id: 1, title: 'Uncomfortable', description: 'John Doe is uncomfortable', date: '2024-10-16T09:00:00Z', acknowledged: 0 },
  { id: 2, title: 'Hungry', description: 'Jane Doe is hungry', date: '2024-10-16T09:15:00Z', acknowledged: 0 },
  { id: 3, title: 'Tired', description: 'John Doe is tired', date: '2024-10-16T09:30:00Z', acknowledged: 0 },
];

const Notif = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState(sampleNotifications); // State to track notifications

  // Function to filter notifications based on the search query
  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to acknowledge a notification
  const handleAcknowledge = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, acknowledged: 1 } : notification
      )
    );
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        {/* Search Bar */}
        <Searchbar
          placeholder="Search Notifications"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                {item.acknowledged === 0 && ( // Only show button if not acknowledged
                  <Button 
                    mode="contained" 
                    onPress={() => handleAcknowledge(item.id)} 
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
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666', // Grey color for description text
  },
  date: {
    fontSize: 12,
    color: '#999999', // Lighter grey for date text
    marginBottom: 8,
  },
  actions: {
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 20, // Rounded button for aesthetics
  },
});

export default Notif;
