import { Divider, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { DecksList } from '../components/DecksList'
import { useCallback, useState } from 'react'
import { LoadingIndicator } from '../../../../shared/LoadingIndicator'
import { useFocusEffect } from '@react-navigation/native'
import { useGetAllQuery } from '../../data/homeApi'
import { AddIcon } from '../../../../shared/Icons'
import { AddDeckModal } from '../components/AddDeckModal'

export default function HomeScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false)
  const { data, isLoading, refetch } = useGetAllQuery()

  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={AddIcon} onPress={() => setAddModalVisible(true)} />
    </>
  )

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, []),
  )

  return (
    <>
      <TopNavigation title="Fiszki" alignment="center" accessoryRight={renderRightActions} />
      <Divider />
      <Layout>
        {addModalVisible ? (
          <AddDeckModal
            onAddCancel={() => setAddModalVisible(false)}
            onAddSuccess={() => setAddModalVisible(false)}
          ></AddDeckModal>
        ) : (
          <></>
        )}

        {isLoading ? <LoadingIndicator /> : <DecksList decks={data!} />}
      </Layout>
    </>
  )
}
