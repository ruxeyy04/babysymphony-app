import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, List } from 'react-native-paper'
import { Icons } from '@/constants'

const Child = () => {
  return (
    <SafeAreaView>
      <View>
        <List.Accordion
          title="Drawer"
          left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item title="Test"/>
        </List.Accordion>
      </View>
    </SafeAreaView>

  )
}

export default Child