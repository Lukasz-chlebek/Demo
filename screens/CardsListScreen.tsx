import { RootStackScreenProps } from '../types'
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import BigList from 'react-native-big-list'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SearchIcon = (props: any) => <Icon {...props} name="search" />

const getItem = (index: any) => ({
  id: Math.random().toString(12).substring(0),
  title: `Item ${index + 1}`,
})

const DATA: any = new Array(500).fill(1).map((_, index) => getItem(index))

export default function CardsListScreen({ navigation }: RootStackScreenProps<'CardsList'>) {
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

  const Item = ({ item }: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    )
  }

  const MyExample = ({ data }: any) => {
    const renderItem = ({ item, index }: any) => {
      return <Item item={item} />
    }
    return <BigList data={data} renderItem={renderItem} itemHeight={150} />
  }

  return (
    <>
      <TopNavigation
        title="Fiszki"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderSearchAction}
      />
      <Divider />
      <Layout style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MyExample data={DATA} keyExtractor={(item: any) => item.id} />
        </View>
      </Layout>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
})
