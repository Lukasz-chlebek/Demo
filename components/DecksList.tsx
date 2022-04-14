import { useState } from 'react'

import { Button, Divider, Icon, List, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'

const OptionsIcon = (props: any) => <Icon name="more-horizontal-outline" {...props} />

export interface Deck {
  id: string
  name: string
  stats: {
    new: number
    review: number
  }
}

const Deck = ({ item }: { item: Deck }) => {
  const navigation = useNavigation<any>() // @TODO: @kamil fixme
  const [visible, setVisible] = useState(false)

  const OptionsButton = (props: any) => (
    <Button {...props} accessoryLeft={OptionsIcon} onPress={() => setVisible(true)} size="small" />
  )

  console.log('navigation', navigation)
  const OptionsMenu = () => (
    <OverflowMenu
      anchor={OptionsButton}
      visible={visible}
      onBackdropPress={() => setVisible(false)}
    >
      <MenuItem title="Zmiana nazwy" />
      <MenuItem
        title="Lista słówek"
        onPress={() => {
          setVisible(false)
          navigation.push('CardsList', { deckId: item.id })
        }}
      />
      <MenuItem title="Dodaj słówko" />
      <MenuItem title="Usuń" />
    </OverflowMenu>
  )

  return (
    <ListItem
      title={`${item.name}`}
      description={`Nowe: ${item.stats.new} Powtorka: ${item.stats.new}`}
      accessoryRight={OptionsMenu}
    />
  )
}

export const DecksList = () => {
  const renderItem = ({ item }: { item: Deck }) => <Deck item={item} />

  const data: Deck[] = [
    {
      id: 'id1',
      name: 'nazwa',
      stats: {
        new: 0,
        review: 0,
      },
    },
  ]

  return <List data={data} renderItem={renderItem} ItemSeparatorComponent={Divider} />
}
