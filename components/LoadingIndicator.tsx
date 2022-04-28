import { Spinner } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'

export const LoadingIndicator = (props: any) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner />
  </View>
)

const styles = StyleSheet.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
