import { ActionSheet, Avatar, Colors, ListItem, Text, View } from 'react-native-ui-lib'
import { Component, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'

function CardListItem({ row }: { row: any }) {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <ActionSheet
        title={'Title'}
        message={'Message goes here'}
        cancelButtonIndex={4}
        destructiveButtonIndex={3}
        options={[
          { label: 'Zmiana nazwy', onPress: () => console.log('cancel') },
          { label: 'Lista słówek', onPress: () => console.log('cancel') },
          { label: 'Dodaj słówko', onPress: () => console.log('cancel') },
          { label: 'Usuń', onPress: () => console.log('cancel') },
          { label: 'Anuluj', onPress: () => console.log('cancel') },
        ]}
        useNativeIOS={true}
        visible={visible}
        onDismiss={() => setVisible(false)}
      />

      <ListItem height={77.5}>
        <ListItem.Part left>
          <Avatar label="TEST" size={50} />
        </ListItem.Part>
        <ListItem.Part middle column containerStyle={styles.border}>
          <Text grey10 text70>
            {row}
          </Text>
          <Text grey50 text90>
            Nowe: 1314 Powtorka: 134
          </Text>
        </ListItem.Part>
        <ListItem.Part containerStyle={styles.border}>
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="black"
            onPress={() => setVisible(true)}
          />
        </ListItem.Part>
      </ListItem>
    </>
  )
}
export default class CardsList extends Component {
  keyExtractor = (item: any) => item

  renderRow(row: any, id: number) {
    return (
      <View>
        <CardListItem row={row} />
      </View>
    )
  }

  render() {
    return (
      <FlatList
        data={[1, 2, 3]}
        renderItem={({ item, index }) => this.renderRow(item, index)}
        keyExtractor={this.keyExtractor}
      />
    )
  }
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70,
  },
})
