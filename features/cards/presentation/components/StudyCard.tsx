import { Button, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LoadingIndicator } from '../../../../shared/LoadingIndicator'
import { StudyItem } from '../../domain/study'
import { useGetCardQuery } from '../../data/cardsApi'

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
})

export const StudyCard = (props: {
  deckId: number
  item: StudyItem
  onPress: () => void
  onPress1: () => void
  onPress2: () => void
  onDoesNotExist: () => void
}) => {
  const [backVisible, setBackVisible] = useState(false)
  const styles = useStyleSheet(themedStyles)

  const { data: card, isLoading } = useGetCardQuery(
    {
      deckId: props.deckId,
      cardId: props.item.cardId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (!card && !isLoading) {
      props.onDoesNotExist()
    }
  }, [card, isLoading])

  useEffect(() => {
    setBackVisible(false)
  }, [card])

  const onShowBackPress = () => {
    setBackVisible(true)
  }

  if (isLoading) {
    return <LoadingIndicator></LoadingIndicator>
  }

  if (!card) {
    return <></>
  }

  return (
    <>
      <ScrollView>
        <Text style={styles.front}>{card.front}</Text>
        {backVisible ? <Text style={styles.back}>{card.back}</Text> : <></>}
      </ScrollView>
      {backVisible ? (
        <>
          <View style={styles.buttonContainer}>
            <Button style={[styles.button]} status="danger" onPress={props.onPress}>
              Nie wiem
            </Button>
            <Button style={[styles.button]} status="warning" onPress={props.onPress1}>
              Trudne
            </Button>
            <Button style={[styles.button]} status="success" onPress={props.onPress2}>
              Wiem
            </Button>
          </View>
        </>
      ) : (
        <Button onPress={onShowBackPress} style={styles.showBack}>
          Pokaż odpowiedź
        </Button>
      )}
    </>
  )
}
