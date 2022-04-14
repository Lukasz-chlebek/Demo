import { RootStackScreenProps } from '../types'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SearchIcon = (props: any) => <Icon {...props} name="search" />

export default function CardsListScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )
  const renderSearchAction = () => (
    <TopNavigationAction
      icon={SearchIcon}
      onPress={() => {
        // @TODO: @kamil display modal with input
        // @TODO: @kamil scroll to desired card
      }}
    />
  )

  return (
    <>
      <TopNavigation
        title="Fiszki"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderSearchAction}
      />
      <Divider />
      <Layout>
        {/*    
        // @TODO: @kamil cards list (virtual scroll)
      */}
      </Layout>
    </>
  )
}

const styles = StyleSheet.create({})
