import React, { Component } from 'react'
import {  View,
          ScrollView,
          Text,
          TextInput,
          StyleSheet,
          TouchableOpacity,
          Platform,
          NativeModules,
          LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import { CheckBox } from 'react-native-elements'
import { Colors } from '../theme'
import DatePickerComponent from '../components/DatePicker'
import PickerComponent from '../components/PickerAlternate'

import ReactNativePickerModule from 'react-native-picker-module'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class VisitorTicketEditor extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedParking: this.props.initialParking,
       fieldsVisible: {},
       'khimkiTime': true,
       'expirationDate': false,
       'additionalFieldsVisible': false,
       'carFieldsVisible': false,
       longTerm: false
     }
  }

  setVisible = (field) => {
    state = this.state
    state[field] = !state[field]
    if(field == 'longTerm'){
      this.props.updateField(state[field], field);
    }
    if(field == 'carFieldsVisible' && !state[field]){
      this.props.updateField('', 'carModelText');
      this.props.updateField('', 'carNumber');
      this.props.updateField('', 'parkingPlace');
      this.props.updateField('', 'parking');
    }
    if(field == 'additionalFieldsVisible' && !state.field){
      this.props.updateField('', 'khimkiEmailGuest');
      this.props.updateField('', 'khimkiEmailMeeting');
      this.props.updateField('', 'phone');
      this.props.updateField('', 'khimkiGuestPhone');
    }
    LayoutAnimation.easeInEaseOut();
    this.setState(state)
  }

  updateField = (data, field) => {
    this.props.updateField(data, field);
    LayoutAnimation.easeInEaseOut();

    var fields = this.state
    fields[field] = data

    var fieldsVisible = {
      expirationDate: fields.longTerm,
      khimkiTime: !fields.longTerm
    }

    fields['fieldsVisible'] = fieldsVisible
    this.setState(fields);
  }

  render () {
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
                        checked={this.state.additionalFieldsVisible}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('additionalFieldsVisible')}}/>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'ФИО посетителя'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'visitorFullName')}}/>
                      {this.state.additionalFieldsVisible &&
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
                              onChangeText={(text) => {this.updateField(text, 'khimkiEmailGuest')}}/>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'Телефон посетителя'}
                              iconClass={Icon}
                              iconName={'phone'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.updateField(text, 'khimkiGuestPhone')}}/>
                          </View>}

                        <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.whoMeets ? Colors.accentColor : '#FFF'}]}
                          label={'ФИО встречающего *'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'whoMeets')}}/>

                      {this.state.additionalFieldsVisible &&
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
                              onChangeText={(text) => {this.updateField(text, 'khimkiEmailMeeting')}}/>
                          <Fumi
                              style={styles.fumiStyle}
                              label={'Телефон встречающего'}
                              iconClass={Icon}
                              iconName={'phone'}
                              iconColor={Colors.textColor}
                              iconSize={20}
                              labelStyle={styles.fumiLabel}
                              inputStyle={styles.fumiInput}
                              onChangeText={(text) => {this.updateField(text, 'phone')}}/>
                          </View>}

                      <CheckBox
                        title='Поля авто'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.carFieldsVisible}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('carFieldsVisible')}}/>
                  </View>
                  {this.state.carFieldsVisible &&
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
                          onChangeText={(text) => {this.updateField(text, 'carModelText')}}/>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'Номер автомобиля'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'carNumber')}}/>
                      <Fumi
                          style={styles.fumiStyle}
                          label={'Место на парковке'}
                          iconClass={Icon}
                          iconName={'directions-car'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'parkingPlace')}}/>
                      <PickerComponent
                          label="Парковка"
                          items={this.props.carParkings}
                          onUpdate={(text) => {this.updateField(text, 'parking')}}/>

                  </View>
                }

                {this.state.additionalFieldsVisible &&
                  <View style={styles.fieldsContainer}>
                    <TextInput
                      placeholder="Примечание"
                      underlineColorAndroid='transparent'
                      style={styles.textInputStyle}
                      multiline={true}
                      scrollEnabled={true}
                      onChangeText={(text) => {this.props.updateField(text, 'note')}}
                      />
                  </View>
                }

                <View style={styles.fieldsContainer}>
                    <CheckBox
                      title='Долгосрочная'
                      containerStyle={styles.checkboxContainer}
                      textStyle={styles.checkboxText}
                      checked={this.state.longTerm}
                      checkedColor={Colors.textColor}
                      onPress={() => {this.setVisible('longTerm')}}/>
                    <DatePickerComponent
                      date={this.props.ticket.visitDate}
                      onUpdate={(date) => {this.updateField(date, 'visitDate')}}
                      label="Дата *"
                      placeholder="Выберите дату"/>
                    {this.state.longTerm &&
                    <DatePickerComponent
                      isHighlighted={this.props.fieldsHighlights.expirationDate}
                      date={this.props.ticket.expirationDate ? this.props.ticket.expirationDate : new Date()}
                      onUpdate={(date) => {this.updateField(date, 'expirationDate')}}
                      label="Дата окончания *"
                      placeholder="Выберите дату"
                      />
                    }
                    <PickerComponent
                      isHighlighted={this.props.fieldsHighlights.khimkiTime}
                      label="Время *"
                      items={this.props.times}
                      onUpdate={(text) => {this.updateField(text, 'khimkiTime')}}/>
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
     backgroundColor: Colors.fieldsColor,
     borderWidth: 5,
     borderColor: '#FFF'
   },
   fumiInput: {
     color: Colors.textColor,
     marginBottom: Platform.OS === 'android' ? 7 : 0
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
     backgroundColor: Colors.buttonColor,
     borderWidth: 5,
     borderColor: '#FFF'
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
   },
   textInputStyle:{
    height: 120,
    borderRadius: 20,
    fontSize: 18,
    color: '#53565A',
    padding: 10,
    borderWidth: 5,
    borderColor: '#FFF'
  }
})
