import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableHighlight
} from 'react-native'

import TicketsListItem from '../components/TicketsListItem'
import { Colors } from '../theme'


const extractKey = ({id}) => id
const status2colors = {
    null: 'gray',
    '12884953000': '#008000',//Принята
    '421575460000': '#214dde',//На территор...
    '421575453000': '#008000',//Выполнена
    '421575459000': '#d12424',//Отклонена
    '4285215000': '#fd9419',//Создана
    '2804833189000': '#d12424',//Повторная
    '4285216000': '#808080',//Закрыта
}
const goodsTypes = {
  '4022223559000': 'Перемещение',
  '4022223531000': 'Вывоз',
  '4022223527000': 'Ввоз'
}

export default class TicketsList extends React.PureComponent {
    renderItem = ({item}) => {
      const header = item.number + ', ' + item.status.name.toString().toLowerCase()
      const name = item.visitorFullName ? item.visitorFullName : ' '
      var type = item.type.name && item.type.name + ' ' + item.visitDate.substr(0,10)
      if(item.type.id == '393629549000'){ console.log(item); type = goodsTypes[item.KhimkiRequestType.id] + ' ' + item.visitDate.substr(0,10) }
      return(
      <View style={{width: '100%', marginBottom: 5}}>
      <TouchableHighlight onPress={() => {return null}} underlayColor="#909090" style={{borderRadius: 10}}>
      <View style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, height: 80}}>
          <View style={{width: 10, backgroundColor: status2colors[item.status && item.status.id], borderRadius: 5}}></View>
          <View style={{flexDirection: 'column', marginLeft: 5}}>

              <Text style={styles.ticketNumber}>{header}</Text>
              <Text style={styles.visitorName}>{name}</Text>
              <Text style={styles.typeName}>{type}</Text>

          </View>
          </View>
      </TouchableHighlight>
      </View>
    )
    }

    render() {
        return (
            <FlatList
                style={{flex: 1, backgroundColor: Colors.backgroundColor}}
                data={this.props.items}
                renderItem={this.renderItem}
                keyExtractor={extractKey} />

        )
    }
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
    },
    ticketNumber:{
      fontSize: 14,
      color: Colors.textColor,
      fontStyle: 'italic'
    },
    visitorName:{
      fontSize: 20,
      color: 'black'
    },
    typeName:{
      fontSize: 14,
      color: Colors.textColor
    },
})
