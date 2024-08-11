import { View, Text, Image, Alert, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, FAB, List, Portal } from 'react-native-paper'
import { Icons } from '@/constants'

const Child = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [toggleStackOnLongPress, setToggleStackOnLongPress] =
    React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const variants = ['primary', 'secondary', 'tertiary', 'surface'];
  const sizes = ['small', 'medium', 'large'];
  const modes = ['flat', 'elevated'];

  return (
    <>
      <SafeAreaView>
        <View>
          <List.Accordion
            title="Drawer"
            left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item title="Test" />
          </List.Accordion>

        </View>
      </SafeAreaView>
      <FAB.Group
          open={open}
          icon={open ? 'calendar-today' : 'plus'}
          toggleStackOnLongPress={toggleStackOnLongPress}
          actions={[
            { icon: 'plus', onPress: () => { } },
            { icon: 'star', label: 'Star', onPress: () => { } },
            { icon: 'email', label: 'Email', onPress: () => { } },
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => { },
              size: 'small'
            },
            {
              icon: toggleStackOnLongPress
                ? 'gesture-tap'
                : 'gesture-tap-hold',
              label: toggleStackOnLongPress
                ? 'Toggle on Press'
                : 'Toggle on Long Press',
              onPress: () => {
                setToggleStackOnLongPress(!toggleStackOnLongPress);
              },
            },
          ]}
          enableLongPressWhenStackOpened
          onStateChange={({ open }: { open: boolean }) => setOpen(open)}
          onPress={() => {
            if (toggleStackOnLongPress) {
              Alert.alert('Fab is Pressed');
              // do something on press when the speed dial is closed
            } else if (open) {
              Alert.alert('Fab is Pressed');
              // do something if the speed dial is open
            }
          }}
          onLongPress={() => {
            if (!toggleStackOnLongPress || open) {
              Alert.alert('Fab is Long Pressed');
              // do something if the speed dial is open
            }
          }}
          visible={visible}
        />
    </>


  )
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  winner: {
    fontWeight: '700',
  },
  listRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  teamResultRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  score: {
    marginRight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  card: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  cardContainer: {
    marginBottom: 80,
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chipsContent: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
});

export default Child