import { RootStackScreenProps } from '../../../../core/navigation/types'
import { Divider, Layout, Spinner, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { View } from 'react-native'
import BigList from 'react-native-big-list'
import { useRef, useState } from 'react'
import { SingleCard } from '../../domain/card'
import { useGetAllForDeckQuery } from '../../data/cardsApi'
import { BackIcon, SearchIcon } from '../../../../shared/Icons'
import { SearchModal } from '../components/SearchCardModal'

const ITEM_HEIGHT = 60

export default function CardsListScreen({ navigation, route }: RootStackScreenProps<'CardsList'>) {
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const list = useRef<BigList<SingleCard> & { scrollToIndex({ index }: { index: number }): void }>(
    null,
  )
  const styles = useStyleSheet(themedStyles)

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )
  const renderSearchAction = () => (
    <TopNavigationAction
      icon={SearchIcon}
      onPress={() => {
        setSearchModalVisible(true)
      }}
    />
  )

  const Item = ({ item }: { item: SingleCard }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.front}</Text>
        <Text style={styles.title2}>{item.back}</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: SingleCard }) => {
    return <Item item={item} />
  }

  const { data, error, isLoading } = useGetAllForDeckQuery({
    deckId: route.params.deckId,
  })

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <SearchModal
            visible={searchModalVisible}
            onSearch={(query) => {
              setSearchModalVisible(false)

              const index = data!.findIndex(
                (i) => i.front.includes(query) || i.back.includes(query),
              )
              if (index) {
                list.current!.scrollToIndex({ index })
              }
            }}
            onCancel={() => setSearchModalVisible(false)}
          ></SearchModal>
          <TopNavigation
            title="Fiszki"
            alignment="center"
            accessoryLeft={renderBackAction}
            accessoryRight={renderSearchAction}
          />
          <Divider />
          <Layout style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <BigList
                ref={list}
                data={data}
                renderItem={renderItem}
                itemHeight={ITEM_HEIGHT}
                keyExtractor={(item) => item.id + ''}
              />
            </View>
          </Layout>
        </>
      )}
    </>
  )
}

const themedStyles = StyleService.create({
  item: {
    display: 'flex',
    flexFlow: 'row',
    height: ITEM_HEIGHT,
    padding: 5,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: 'border-basic-color-5',
  },
  title: {
    flex: 1,
    fontSize: 12,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  title2: {
    flex: 1,
    fontSize: 12,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderLeftStyle: 'solid',
    borderLeftWidth: 1,
    borderLeftColor: 'border-basic-color-5',
  },
})
