import { StyleSheet } from 'react-native'

import { RootTabScreenProps } from '../types'
import { View } from 'react-native-ui-lib'
import CardsList from '../components/CardsList'

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View flex paddingH-25 paddwingT-120 bg-white>
      <CardsList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
