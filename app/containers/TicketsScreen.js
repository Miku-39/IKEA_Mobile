import React, { Component } from 'react'
import { View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Keyboard,
  StyleSheet,
  FlatList
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'

import { Metrics, Colors } from '../theme'
import { fetch } from '../middleware/redux/actions/Tickets'
import { getTickets, getTicket } from '../middleware/redux/selectors'
import Loader from '../components/Loader'

const headerButtonsHandler = {
    refresh: () => null,
    search: () => null
}
const CAME_STATUS_ID = '421575460000'
const WENT_STATUS_ID = '421575453000'

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

@connect(
    store => ({
        tickets: getTickets(store),
        ticket: getTicket(store)
    }),
    { fetch }
)
export default class TicketsScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Заявки',
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.refresh()}>
                        <MaterialIcons name='autorenew' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 14, marginRight: 10}} onPress={() => headerButtonsHandler.search()}>
                        <MaterialIcons name='search' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    state = {
        items: [],
        searchBarIsShown: false
    }

    componentDidMount () {
        headerButtonsHandler.search = this._handleShowSearchBarClick
        headerButtonsHandler.refresh = this._handleRefreshClick
        this.props.fetch()
    }

    componentWillReceiveProps (nextProps) {
        const { items } = nextProps.tickets
        this.setState({ items: items })
    }

    _handleRefreshClick = () => {
        this._handleHideSearchBarClick()
        this.props.fetch()
    }

    _handleShowSearchBarClick = () => {
        const { searchBarIsShown } = this.state
        if (!searchBarIsShown)
          this.setState({searchBarIsShown: true})
    }

    _handleHideSearchBarClick = () => {
        this.setState({searchBarIsShown: false})
        Keyboard.dismiss()
    }

    _handleSearchTextChanged = (text) => {
        const filter = text.toLowerCase()
        const { items } = this.props.tickets
        let data

        if (filter) {
            data = items.filter(item => item.visitorFullName && item.visitorFullName.toLowerCase().includes(filter))
        } else {
            data = items
        }
        this.setState({items: data})
    }





    renderItem = ({item}) => {
      const { navigation } = this.props
      const header = item.number + ', ' + item.status.name.toString().toLowerCase()
      const name = item.visitorFullName ? item.visitorFullName : ' '
      var type = item.type.name && item.type.name + ' ' + item.visitDate.substr(0,10)
      if((item.type.id == '393629549000') && item.KhimkiRequestType){ type = goodsTypes[item.KhimkiRequestType.id] + ' ' + item.visitDate.substr(0,10) }

      return(
      <View style={{width: '100%', marginBottom: 5}}>
      <TouchableHighlight onPress={() => {navigation.navigate('Ticket', {ticket: item})}} underlayColor={Colors.accentColor} style={{borderRadius: 10}}>
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
        const { navigation } = this.props
        const { items, searchBarIsShown } = this.state
        const { isFetching, fetched } = this.props.tickets
        const extractKey = ({id}) => id

        return (
            <View style={{flex: 1}}>
                {
                    searchBarIsShown &&
                    <SearchBar
                        lightTheme
                        clearIcon={{color: '#53565A', name: 'close'}}
                        inputStyle={{backgroundColor: 'white', fontSize: 20}}
                        containerStyle={{backgroundColor: Colors.accentColor, height: Metrics.navBarHeight, width: '100%', marginTop: -1}}
                        onChangeText={this._handleSearchTextChanged}
                        onClearText={this._handleHideSearchBarClick}
                        placeholder='Поиск...'
                    />
                }

                <Loader message='Обновление заявок' isLoading={isFetching}>
                  <FlatList
                      style={{flex: 1, backgroundColor: Colors.backgroundColor}}
                      data={items}
                      renderItem={this.renderItem}
                      keyExtractor={extractKey} />
                </Loader>
            </View>
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
