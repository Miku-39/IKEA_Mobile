import React, { Component } from 'react'
import { View,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import TicketEditor from '../components/TicketEditor'
import Loader from '../components/Loader'
import * as selectors from '../middleware/redux/selectors'
import { add, addFile, dismiss } from '../middleware/redux/actions/Ticket'

import { getSession } from '../middleware/redux/selectors'
import { storeCredentials, loadCredentials } from '../middleware/utils/AsyncStorage'
const NEW_TICKET_STATUS_ID = '4285215000';

const VISITOR_TICKET_TYPE = '393629546000';
const CARD_TICKET_TYPE = '437149164000';
const GOODS_TICKET_TYPE = '393629549000';

const headerButtonsHandler = { save: () => null }


@connect(
    store => ({
        employeeId: selectors.getEmployeeId(store),
        companyId: selectors.getCompanyId(store),
        isAdding: selectors.getIsTicketAdding(store),
        added: selectors.getIsTicketAdded(store),
        error: selectors.getIsTicketAddingFailed(store),
        session: getSession(store)
    }),
    dispatch => ({
        addTicket: (ticket) => dispatch(add(ticket)),
        addFile: (file) => dispatch(addFile(file)),
        dismiss: () => dispatch(dismiss())
    })
)
export default class TicketScreen extends Component {
    static navigationOptions = ({navigation}) => {
        switch(navigation.state.params.ticketType){
          case 'VISITOR':
              headerTitle = 'Гость'
              break;
          case 'GOODS':
              headerTitle = 'Внос/вынос'
              break;
        }
        return ({
            title: headerTitle,
            headerRight: (
                <View style={{flexDirection: 'row', paddingRight: 7}}>
                    <TouchableOpacity onPress={() => headerButtonsHandler.save()}>
                      <Icon name='check' color='#FFF' size={30}/>
                    </TouchableOpacity>
                </View>
            )
        })
    }


    componentWillMount() {
        const { showCarFields, showGoodsFields, ticketType } = this.props.navigation.state.params
        const { employeeId, companyId, session } = this.props
        switch(ticketType) {
          case 'VISITOR':
              ticketTypeId = VISITOR_TICKET_TYPE;
              break;
          case 'GOODS':
              ticketTypeId = GOODS_TICKET_TYPE;
              break;
          case 'CARD':
              ticketTypeId = CARD_TICKET_TYPE;
                break;
        }
        const nowDate = new Date();

        const ticket = {
            visitorFullName: '',
            carModelText: '',
            carNumber: '',
            actualCreationDate: nowDate,
            visitDate: nowDate,
            expirationDate: nowDate,
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: ticketTypeId,
            client: companyId,
            nonstandardCarNumber: true,
            materialValuesData: '',
            longTerm: false
        }

        this.setState({ticket: ticket, showCarFields: showCarFields,
           showGoodsFields: showGoodsFields,
           ticketType: ticketType, session: session})
    }

    componentDidMount() {
        headerButtonsHandler.save = this.save
    }

    componentWillReceiveProps(newProps) {
        const { added, error } = newProps
        const { goBack } = this.props.navigation

        if (added){
            Alert.alert( '', 'Добавлено успешно',
            [
                {text: 'Закрыть', onPress: () => {}}
            ])
            this.props.dismiss()
        }

        if (error) {
            Alert.alert( 'Ошибка', 'При сохранении возникла ошибка.',
            [
                {text: 'Закрыть', onPress: () => { }}
            ])
        }
    }

    save = () => {
        const { ticket } = this.state
        const { ticketType } = this.props.navigation.state.params

        if(!ticket.carNumber || !ticket.carModelText){
          ticket.parking = null
        }
        if(!ticket.visitorFullName || !ticket.whoMeets){
          Alert.alert( 'Ошибка', 'Не заполнены обязательные поля',
          [{text: 'Закрыть', onPress: () => { }}])
        }else{
          this.props.addTicket(ticket)
        }
        console.log(ticket)

    }

    saveFile = (file) => {
        this.props.addFile(file)
    }

    updateField = (data, field) => {
      const { ticket } = this.state
      ticket[field] = data
      console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
      console.log(ticket)
      this.setState({ticket})
    }

    updateLongTerm = check => {
        const { ticket } = this.state
        ticket.longTerm = check
        this.setState({ticket})
    }


    render = () => {
        const { ticket, ticketType, session} = this.state
        const { isAdding } = this.props
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding}>
                <TicketEditor
                    ticket={ticket}
                    updateLongTerm={this.updateLongTerm}
                    updateField={this.updateField}
                    saveFile={this.saveFile}

                    ticketType={ticketType}

                    carParkings={session.carParkings}
                    goodsParkings={session.goodsParkings}
                    services={session.services}
                />
            </Loader>
        )
    }
}
