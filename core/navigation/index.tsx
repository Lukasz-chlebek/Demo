import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'
import NotFoundScreen from './NotFoundScreen'
import HomeScreen from '../../features/home/presentation/screens/HomeScreen'
import { RootStackParamList } from './types'
import LinkingConfiguration from './LinkingConfiguration'
import CardsListScreen from '../../features/cards/presentation/screens/CardsListScreen'
import StudyScreen from '../../features/cards/presentation/screens/StudyScreen'
import AddCardScreen from '../../features/cards/presentation/screens/AddCardScreen'
import EditCardLoaderScreen from '../../features/cards/presentation/screens/EditCardScreen'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      <Stack.Screen name="CardsList" component={CardsListScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="EditCard" component={EditCardLoaderScreen} />
      <Stack.Screen name="Study" component={StudyScreen} />
    </Stack.Group>
  </Stack.Navigator>
)
