import React, { Component } from 'react'
import {  View,
          ScrollView,
          Text,
          StyleSheet,
          Picker,
          TouchableOpacity,
          Platform,
          NativeModules,
          LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import { CheckBox } from 'react-native-elements'
import { Images, Colors } from '../theme'
import DatePickerComponent from '../components/DatePicker'
import PickerComponent from '../components/Picker'
import ReactNativePickerModule from 'react-native-picker-module'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class TicketScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedParking: this.props.initialParking,
       longTerm: false,
       allFields: false
     }
  }

  updateLongTerm = () =>{
    LayoutAnimation.easeInEaseOut()
    this.setState({longTerm: !this.state.longTerm})
    this.props.updateLongTerm(!this.state.longTerm)
  }

  showAllFields = () =>{
    LayoutAnimation.easeInEaseOut()
    this.setState({allFields: !this.state.allFields})
  }


  render () {
    parkings = this.props.carParkings;
    parkingsByIndex = parkings.map(parking => {return parking.name})
    idByIndex = parkings.map(parking => {return parking.id})
    androidMargin = Platform.OS === 'android' ? 7 : 0
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView style={{backgroundColor: Colors.backgroundColor}}>
              <View style={{
                flexDirection: 'column',
                marginBottom: 150}}>
                  <View style={styles.fieldsContainer}>
                      <CheckBox
                        title='Дополнительные поля'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.allFields}
                        checkedColor={Colors.textColor}
                        onPress={this.showAllFields}/>
                      <CheckBox
                        title='Долгосрочная'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.longTerm}
                        checkedColor={Colors.textColor}
                        onPress={this.updateLongTerm}/>
                  </View>

                  <View style={styles.fieldsContainer}>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'ФИО посетителя'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={this.props.updateVisitor}/>
                      {this.state.allFields &&
                          <View>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'E-mail посетителя'}
                              iconClass={Icon}
                              iconName={'mail'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.props.updateTextField(text, 'khimkiEmailGuest')}}/>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'Телефон посетителя'}
                              iconClass={Icon}
                              iconName={'phone'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.props.updateTextField(text, 'khimkiGuestPhone')}}/>
                          </View>}
                      <Fumi
                          style={styles.fumiStyle}
                          label={'ФИО встречающего'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.props.updateTextField(text, 'whoMeets')}}/>
                      {this.state.allFields &&
                          <View>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'E-mail встречающего'}
                              iconClass={Icon}
                              iconName={'mail'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.props.updateTextField(text, 'khimkiEmailMeeting')}}/>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'Телефон встречающего'}
                              iconClass={Icon}
                              iconName={'phone'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.props.updateTextField(text, 'phone')}}/>
                          </View>}
                  </View>

                  <View style={styles.fieldsContainer}>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'Марка автомобиля'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={this.props.updateCarModel}/>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'Номер автомобиля'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={this.props.updateCarNumber}/>
                      <PickerComponent
                          items={parkings}
                          label="Парковка"
                          idByIndex={idByIndex}
                          itemsByIndex={parkingsByIndex}
                          onUpdate={this.props.updateParking}/>
                  </View>

                  <View style={styles.fieldsContainer}>
                      <DatePickerComponent
                            date={this.props.ticket.visitDate}
                            onUpdate={this.props.updateVisitDate}
                            label="Дата посещения"
                            placeholder="Выберите дату"/>
                      {this.state.longTerm &&
                        <DatePickerComponent
                                date={this.props.ticket.expirationDate}
                                onUpdate={this.props.updateExpirationDate}
                                label="Дата окончания"
                                placeholder="Выберите дату"
                                />
                      }
                  </View>

                </View>
            </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
   fieldsContainer: {
     backgroundColor: Colors.fieldsColor,
     borderRadius: 20,
     marginBottom: 10
   },
   fumiStyle: {
     borderRadius: 20,
     backgroundColor: Colors.fieldsColor
   },
   fumiInput: {
     color: Colors.textColor
   },
   fumiLabel: {
     color: Colors.textColor
   },
   picker: {
     borderRadius: 20,
     marginTop: 5,
     width: 200,
     height: 40,
     alignSelf: 'center',
     alignItems: 'center',
     backgroundColor: Colors.buttonColor
   },
   pickerLabel: {
     fontWeight: 'bold',
     color: Colors.textColor,
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center'
   },
   pickerText:{
     fontSize: 18,
     alignSelf: 'center',
     margin: 8,
     color: Colors.textColor
    },
   checkboxContainer: {
     marginTop: 8,
     backgroundColor: Colors.fieldsColor,
     borderRadius: 10,
     borderWidth: 0
   },
   checkboxText: {
     fontSize: 16,
     fontWeight: 'bold',
     color: Colors.textColor
   }
})