import { RootStackScreenProps } from '../types'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SaveIcon = (props: any) => <Icon {...props} name="save" />

export default function AddCardScreen({ navigation }: RootStackScreenProps<'AddCard'>) {
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )

  const renderSaveAction = () => <TopNavigationAction icon={SaveIcon} onPress={() => {}} />

  return (
    <>
      <TopNavigation
        title="Dodaj kartę"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderSaveAction}
      />
      <Divider />
      <Layout></Layout>
    </>
  )
}

const styles = StyleSheet.create({})
