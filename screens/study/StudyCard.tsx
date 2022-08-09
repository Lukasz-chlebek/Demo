import { Button, Spinner, Text } from '@ui-kitten/components'
import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetCardQuery } from '../../data/api'
import { StudyItem } from '../../data/model'

export const StudyCard = (props: {
  deckId: string
  item: StudyItem
  styles: any
  onPress: () => void
  onPress1: () => void
  onPress2: () => void
  onDoesNotExist: () => void
}) => {
  const [backVisible, setBackVisible] = useState(false)

  const { data, error, isLoading } = useGetCardQuery(
    {
      deckId: props.deckId,
      cardId: props.item.cardId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (!data && !isLoading) {
      props.onDoesNotExist()
    }
  }, [data])

  useEffect(() => {
    setBackVisible(false)
  }, [data])

  return isLoading || !data ? (
    <Spinner />
  ) : (
    <>
      <ScrollView>
        <Text style={props.styles.front}>{data!.front}</Text>

        {backVisible ? <Text style={props.styles.back}>{data!.back}</Text> : <></>}
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
        <Button
          onPress={() => {
            setBackVisible(true)
          }}
          style={props.styles.showBack}
        >
          Pokaż odpowiedź
        </Button>
      )}
    </>
  )
}
