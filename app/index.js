import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

import StackNavigator from '../navigation/StackNavigator'

export default function app() {
  return (
    <>
      
        <StackNavigator />
      
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})

