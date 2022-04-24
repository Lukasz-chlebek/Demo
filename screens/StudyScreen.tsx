import { RootStackScreenProps } from '../types'
import {
  Button,
  Divider,
  Icon,
  Layout,
  MenuItem,
  OverflowMenu,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components'
import { ScrollView, View } from 'react-native'
import React, { useState } from 'react'

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

  const [backVisible, setBackVisible] = useState(false)
  const styles = useStyleSheet(themedStyles)

  return (
    <>
      <TopNavigation
        title="Nauka"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout style={{ flex: 1 }}>
        <ScrollView>
          <Text style={styles.front}>Front</Text>

          {backVisible ? <Text style={styles.back}>Back</Text> : ''}
        </ScrollView>

        {backVisible ? (
          <>
            <View style={styles.buttonContainer}>
              <Button style={[styles.button, styles.dontKnow]} onPress={() => {}}>
                Nie wiem
              </Button>
              <Button style={[styles.button, styles.difficult]} onPress={() => {}}>
                Trudne
              </Button>
              <Button style={[styles.button, styles.know]} onPress={() => {}}>
                Wiem
              </Button>
            </View>
          </>
        ) : (
          <Button onPress={() => setBackVisible(true)} style={styles.showBack}>
            Pokaż odpowiedź
          </Button>
        )}
      </Layout>
    </>
  )
}

const themedStyles = StyleService.create({
  front: {
    fontSize: 17,
    padding: 25,
    textAlign: 'center',
  },
  back: {
    fontSize: 17,
    borderTopWidth: 1,
    borderTopColor: 'color-basic-default-border',
    padding: 25,
    textAlign: 'center',
  },
  showBack: {
    margin: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  dontKnow: {
    backgroundColor: '#969696',
    borderColor: '#969696',
    color: 'white',
  },
  difficult: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
    color: 'white',
  },
  know: {
    backgroundColor: '#3CA617',
    borderColor: '#3CA617',
    color: 'white',
  },
})
