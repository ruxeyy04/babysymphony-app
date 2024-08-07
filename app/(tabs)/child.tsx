import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Child = () => {
  return (
    <SafeAreaView>
    <View>
      <Text>Children</Text>
    </View>
    </SafeAreaView>

  )
}

export default Child