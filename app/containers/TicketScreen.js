import React, { Component } from 'react'
import { View, Alert, TouchableOpacity, Text } from 'react-native'

import { Colors } from '../theme'

export default class TicketScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Заявка №'
        })
    }

    state = {
    }

    render() {
      const {ticket} = this.props.navigation.state.params
      console.log(this.props)
        return (
            <View style={{flex: 1}}>
                <Text>{ticket.number}</Text>
            </View>
        )
    }
}
