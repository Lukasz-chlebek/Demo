import { RootStackScreenProps } from '../../../../core/navigation/types'
import {
  Button,
  Card,
  Divider,
  Icon,
  Input,
  Layout,
  Modal,
  Spinner,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import BigList from 'react-native-big-list'
import { useRef, useState } from 'react'
import { useGetAllForDeckQuery } from '../../../../data/api'
import { SingleCard as CardData } from '../../../../data/model'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SearchIcon = (props: any) => <Icon {...props} name="search" />

const ITEM_HEIGHT = 60

const SearchModal = ({
  visible,
  onSearch,
  onCancel,
}: {
  visible: boolean
  onSearch: (query: string) => void
  onCancel: () => void
}) => {
  const [query, setQuery] = useState('')

  const onSearchPress = () => {
    onSearch(query)
  }

  const onBackDropPress = () => {
    onCancel()
  }

  const onCancelPress = () => {
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      style={{ width: 300 }}
      backdropStyle={modalStyles.backdrop}
      onBackdropPress={onBackDropPress}
    >
      <Card disabled={true}>
        <Text category="s1">Szukaj...</Text>
        <Input
          style={modalStyles.input}
          value={query}
          onChangeText={(nextValue) => setQuery(nextValue)}
        />
        <View style={modalStyles.actionContainer}>
          <Button appearance="ghost" onPress={onCancelPress}>
            Anuluj
          </Button>
          <Button onPress={onSearchPress}>Szukaj</Button>
        </View>
      </Card>
    </Modal>
  )
}

const modalStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    marginVertical: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default function CardsListScreen({ navigation, route }: RootStackScreenProps<'CardsList'>) {
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const list = useRef<any>(null)
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

  const Item = ({ item }: { item: CardData }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.front}</Text>
        <Text style={styles.title2}>{item.back}</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: CardData }) => {
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

              const index = data!.findIndex((i) => i.front.includes(query) || i.back.includes(query))
              if (index) {
                list.current.scrollToIndex({ index })
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
                keyExtractor={(item) => item.id}
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
