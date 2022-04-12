import { useState } from 'react'

import { Button, Divider, Icon, List, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components'

const OptionsIcon = (props: any) => <Icon name="more-vertical-outline" {...props} />

const Deck = ({ item, index }: { item: any; index: number }) => {
  const [visible, setVisible] = useState(false)

  const OptionsButton = (props: any) => (
    <Button {...props} accessoryLeft={OptionsIcon} onPress={() => setVisible(true)} />
  )

  const OptionsMenu = () => (
    <OverflowMenu
      anchor={OptionsButton}
      visible={visible}
      onBackdropPress={() => setVisible(false)}
    >
      <MenuItem title="Zmiana nazwy" />
      <MenuItem title="Lista słówek" />
      <MenuItem title="Dodaj słówko" />
      <MenuItem title="Usuń" />
    </OverflowMenu>
  )

  return (
    <ListItem
      title={`${item} ${index + 1}`}
      description={`Nowe: 1314 Powtorka: 134`}
      accessoryRight={OptionsMenu}
    />
  )
}

export const DecksList = () => {
  const renderItem = ({ item, index }: any) => <Deck item={item} index={index} />

  return <List data={[1, 2, 3]} renderItem={renderItem} ItemSeparatorComponent={Divider} />
}
