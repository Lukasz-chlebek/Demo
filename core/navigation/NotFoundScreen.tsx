import { StyleSheet, TouchableOpacity } from 'react-native'
import { RootStackScreenProps } from './types'
import { Layout, Text } from '@ui-kitten/components'

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  return (
    <Layout style={styles.container}>
      <Text category="h5">This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.link}>
        <Text status="primary">Go to home screen!</Text>
      </TouchableOpacity>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
