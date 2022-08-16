import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

import React, { useEffect, useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { Provider } from 'react-redux'
import { store } from './store'
import { ready } from './data/api'

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const [dbLoaded, setDbLoaded] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await ready()
        setDbLoaded(true)
      } catch (e) {
        console.error('DB init failed', e)
      }
    })()
  }, [])

  if (!isLoadingComplete || !dbLoaded) {
    return null
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva[colorScheme]}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </ApplicationProvider>
        </SafeAreaProvider>
      </Provider>
    )
  }
}
