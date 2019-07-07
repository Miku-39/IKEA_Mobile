import React, { Component } from 'react'
import { View,
  DatePickerAndroid,
  DatePickerIOS,
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
import { timeId, hourId } from '../containers/timeHour'
const NEW_TICKET_STATUS_ID = '4285215000';

const CAR_TICKET_TYPE = '393629546000';
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
          case 'CAR':
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
          case 'CAR':
              ticketTypeId = CAR_TICKET_TYPE;
              break;
          case 'GOODS':
              ticketTypeId = GOODS_TICKET_TYPE;
              break;
        }
        const nowDate = new Date();
        const minDate = nowDate
        minDate.setMinutes(minDate.getMinutes() + 5 - minDate.getMinutes() % 5)

        ticketParkingType = ticketType == 'CAR' ? '3590481191000' : '3590077188000'
        ticketParking = ticketType == 'CAR' ? session.carParkings[0].id : session.goodsParkings[0].id
        if(ticketType == 'VISITOR' || ticketType == 'SERVICE'){
          ticketParking = null;
          ticketParkingType = null;
        }

        ticketHour = ((minDate.getHours()<10?'0':'') + minDate.getHours())
        ticketTime = ((minDate.getMinutes()<10?'0':'') + minDate.getMinutes())

        const ticket = {
            visitorFullName: '',
            carModelText: '',
            carNumber: '',
            actualCreationDate: nowDate,
            visitDate: minDate,
            expirationDate: nowDate,
            hour: hourId(ticketHour),
            time: timeId(ticketTime),
            author: employeeId,
            status: NEW_TICKET_STATUS_ID,
            type: ticketTypeId,
            client: companyId,
            nonstandardCarNumber: true,
            parkingType: ticketParkingType,
            parking: ticketParking,
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
                {text: 'Закрыть', onPress: () => { goBack() }}
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
          ticket.parkingType = null
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

    updateVisitor = text => {
        const { ticket } = this.state
        ticket.visitorFullName = text
        this.setState({ticket})
    }

    updateTextField = (text, field) => {
      const { ticket } = this.state
      ticket[field] = text
      console.log(ticket)
      this.setState({ticket})
    }

    updateCarModel = text => {
        const { ticket } = this.state
        ticket.carModelText = text
        this.setState({ticket})
    }

    updateCarNumber = text => {
        const { ticket } = this.state
        ticket.carNumber = text
        this.setState({ticket})
    }

    updateGoods = text => {
        const { ticket } = this.state
        ticket.materialValuesData = text
        this.setState({ticket})
    }

    updateParking = (name, id) => {
      const { ticket } = this.state
      ticket.parking = id
      this.setState({ticket})
    }

    updateLongTerm = check => {
        const { ticket } = this.state
        ticket.longTerm = check
        this.setState({ticket})
    }

    updateVisitDate = date => {
        const { ticket } = this.state
        ticket.visitDate = date
        if ( ticket.parking == 3588462098000 ) {
          minutes = parseInt(date.substr(14,2))
          minutes = (minutes % 5 != 0) ? (minutes + 5 - minutes % 5) : minutes
          minutes = (minutes<10?'0':'') + minutes
          hours = date.substr(11,2)
          ticket.time = timeId(minutes)
          ticket.hour = hourId(hours)
        } else {
          ticket.time = null
          ticket.hour = null
        }
        this.setState({ticket})
    }

    updateExpirationDate = date => {
        const { ticket } = this.state
        ticket.expirationDate = date
        this.setState({ticket})
    }

    render = () => {
        const { ticket, showCarFields, showGoodsFields,
           ticketType, session, selectedValue, selectedParking} = this.state
        const { isAdding } = this.props
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;
        return (
            <Loader message='Сохранение' isLoading={isAdding}>
                <TicketEditor
                    ticket={ticket}
                    updateVisitor={this.updateVisitor}
                    updateCarModel={this.updateCarModel}
                    updateCarNumber={this.updateCarNumber}
                    updateVisitDate={this.updateVisitDate}
                    updateExpirationDate={this.updateExpirationDate}
                    updateParkingPlace={this.updateParkingPlace}
                    updateParking={this.updateParking}
                    updateLongTerm={this.updateLongTerm}
                    updateGoods={this.updateGoods}
                    updateTextField={this.updateTextField}
                    saveFile={this.saveFile}

                    showCarFields={showCarFields}
                    showGoodsFields={showGoodsFields}

                    ticketType={ticketType}

                    initialParking={ticketType == 'CAR' ? session.carParkings[0].name : session.goodsParkings[0].name}
                    carParkings={session.carParkings}
                    goodsParkings={session.goodsParkings}
                    services={session.services}
                />
            </Loader>
        )
    }
}