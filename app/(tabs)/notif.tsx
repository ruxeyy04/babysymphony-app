import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Provider } from 'react-native-paper'

const Notif = () => {
  return (
    <Provider>
      <SafeAreaView>
        <View>
          <Text>notification</Text>
        </View>
        <Button
          mode="contained-tonal"
          icon="camera"
          onPress={() => { }}
          className='bg-red-200'
        >
          Icon
        </Button>
      </SafeAreaView>
    </Provider>


  )
}


export default Notif