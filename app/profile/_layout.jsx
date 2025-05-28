import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "Profile",
        }}/>
        <Stack.Screen
        name="[id]/mycart"
        options={{
          headerShown: false,
          title: "My Cart",
        }}
        
        />
        <Stack.Screen
        name="[id]/mypurchase"
        options={{          
          headerShown: false,
          title: "My Purchase",
        }}
        
        />
    </Stack>
  )
}