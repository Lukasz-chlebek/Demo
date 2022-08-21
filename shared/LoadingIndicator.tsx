import { Spinner } from '@ui-kitten/components'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export const LoadingIndicator = (props: { style?: StyleProp<ViewStyle> }) => (
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
