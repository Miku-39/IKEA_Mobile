import React, { Component } from 'react'
import { View, Text, Alert, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import MainComponent from '../components/MainComponent'

export default class MainScreenContainer extends Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Кларис'
        })
    }

    render = () => {
        const { navigate } = this.props.navigation
        return (

          <MainComponent
              addVisitTicket={() => navigate('Ticket', {ticketType: 'VISITOR'})}
              addCardTicket={() => navigate('Visitor', {ticketType: 'CARD'})}
              addGoodsTicket={() => navigate('Ticket', {ticketType: 'GOODS'})}
              addServiceTicket={() => navigate('Visitor', {ticketType: 'SERVICE'})}
              openTickets={() => navigate('Tickets')}
          />
        )
    }
}
