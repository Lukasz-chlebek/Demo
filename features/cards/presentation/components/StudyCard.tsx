import { Button, Text } from '@ui-kitten/components'
import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LoadingIndicator } from '../../../../shared/LoadingIndicator'
import { StudyItem } from '../../domain/study'
import { useGetCardQuery } from '../../data/cardsApi'

export const StudyCard = (props: {
  deckId: number
  item: StudyItem
  styles: any
  onPress: () => void
  onPress1: () => void
  onPress2: () => void
  onDoesNotExist: () => void
}) => {
  const [backVisible, setBackVisible] = useState(false)

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
        <Text style={props.styles.front}>{card.front}</Text>
        {backVisible ? <Text style={props.styles.back}>{card.back}</Text> : <></>}
      </ScrollView>
      {backVisible ? (
        <>
          <View style={props.styles.buttonContainer}>
            <Button style={[props.styles.button]} status="danger" onPress={props.onPress}>
              Nie wiem
            </Button>
            <Button style={[props.styles.button]} status="warning" onPress={props.onPress1}>
              Trudne
            </Button>
            <Button style={[props.styles.button]} status="success" onPress={props.onPress2}>
              Wiem
            </Button>
          </View>
        </>
      ) : (
        <Button onPress={onShowBackPress} style={props.styles.showBack}>
          Pokaż odpowiedź
        </Button>
      )}
    </>
  )
}
