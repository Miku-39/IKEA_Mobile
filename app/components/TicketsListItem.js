import React from 'react'
import { View, Text, Button, Alert, TouchableHighlight, YellowBox, StyleSheet } from 'react-native'
import { Images, Colors } from '../theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class TicketsListItem extends React.PureComponent {
    render() {
      const {item} = this.props
    return null
}
}

const status2colors = {
    null: '#000000',
    '12884953000': '#008000',  // Принята
    '421575460000': '#214dde', // На территории
    '421575453000': '#008000', // Выполнена
    '421575459000': '#d12424', // Отклонена
    '4285215000': '#fd9419',   // Создана
    '2804833189000': '#d12424',// Повторная
    '4285216000': '#808080',   // Закрыта
    '3367462500000': '#fd9419', //Согласовано УК
    '2804833187000': '#000099' //Выдан пропуск
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundColor
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
})
