import { RootStackScreenProps } from '../types'
import { Divider, Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { useState } from 'react'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />

export default function StudyScreen({ navigation }: RootStackScreenProps<'Study'>) {
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )

  const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />

  const renderRightActions = () => (
    <>
      <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem title="Edytuj kartę" />
        <MenuItem title="Usuń kartę" />
      </OverflowMenu>
    </>
  )

  return (
    <>
      <TopNavigation
        title="Nauka"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout></Layout>
    </>
  )
}

const styles = StyleSheet.create({})
