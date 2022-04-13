import { RootStackScreenProps } from '../types'
import { Divider, Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { DecksList } from '../components/DecksList'
import { useState } from 'react'

const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />

export default function TabOneScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />

  const renderRightActions = () => (
    <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
      <MenuItem title="Eksport" />
      <MenuItem title="Import" />
    </OverflowMenu>
  )

  return (
    <>
      <TopNavigation title="Fiszki" alignment="center" accessoryRight={renderRightActions} />
      <Divider />
      <Layout>
        <DecksList />
      </Layout>
    </>
  )
}
