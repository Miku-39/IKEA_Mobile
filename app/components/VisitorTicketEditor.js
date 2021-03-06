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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
       fieldsVisible: {
         parkingPlace: true
       },
       'khimkiTime': true,
       'expirationDate': false,
       'additionalFieldsVisible': false,
       'carFieldsVisible': false,
       longTerm: false,
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

    var date = fields['visitDate']
    var minDate
    if(date){
      date = new Date(date)
      minDate = new Date(date)
      date.setDate(date.getDate() + 4)
    }else{
      date = new Date()
      minDate = new Date()
      date.setDate(date.getDate() + 4)
    }


    var fieldsVisible = {
      expirationDate: fields.longTerm,
      khimkiTime: !fields.longTerm,
      parkingPlace: fields.parking != '4063239747000',
      maxExpirationDate: fields.parking == '4063239747000' ? date : null,
      minExpirationDate: minDate
    }
    console.log(fieldsVisible.maxExpirationDate)
    fields['fieldsVisible'] = fieldsVisible
    this.setState(fields);
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}>
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={130}
            extraScrollHeight={130}>

                <View style={{
                  flexDirection: 'column',
                  marginBottom: 150}}>

                  <View style={styles.fieldsContainer}>
                    <Text style={styles.field}>На гостя и парковку</Text>
                  </View>

                  <View style={styles.fieldsContainer}>
                      <DatePickerComponent
                        date={this.props.ticket.visitDate}
                        onUpdate={(date) => {this.updateField(date, 'visitDate')}}
                        label="Дата *"
                        placeholder="Выберите дату"/>
                      <PickerComponent
                        isHighlighted={this.props.fieldsHighlights.khimkiTime}
                        label="Время *"
                        items={this.props.times}
                        onUpdate={(text) => {this.updateField(text, 'khimkiTime')}}/>
                      <CheckBox
                        title='Долгосрочная'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.longTerm}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('longTerm')}}/>
                      {this.state.longTerm &&
                      <DatePickerComponent
                        isHighlighted={this.props.fieldsHighlights.expirationDate}
                        date={this.props.ticket.expirationDate ? this.props.ticket.expirationDate : new Date()}
                        onUpdate={(date) => {this.updateField(date, 'expirationDate')}}
                        label="Действует до *"
                        placeholder="Выберите дату"
                        maxDate={this.state.fieldsVisible.maxExpirationDate}
                        minDate={this.state.fieldsVisible.minExpirationDate}
                        />
                      }
                  </View>

                  <View style={styles.fieldsContainer}>
                      <CheckBox
                        title='Дополнительные поля'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.additionalFieldsVisible}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('additionalFieldsVisible')}}/>
                      <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.visitorFullName ? Colors.accentColor : '#FFF'}]}
                          label={'ФИО посетителя *'}
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
                  </View>

                  <View style={styles.fieldsContainer}>
                      <CheckBox
                        title='Автомобиль'
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checked={this.state.carFieldsVisible}
                        checkedColor={Colors.textColor}
                        onPress={() => {this.setVisible('carFieldsVisible')}}/>
                  {this.state.carFieldsVisible &&
                      <View>
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
                      <PickerComponent
                          label="Парковка"
                          items={this.props.carParkings}
                          onUpdate={(text) => {this.updateField(text, 'parking')}}/>
                    {this.state.fieldsVisible.parkingPlace &&
                    <Fumi
                          style={styles.fumiStyle}
                          label={'Место на парковке'}
                          iconClass={Icon}
                          iconName={'room'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'parkingPlace')}}/>}
                  </View>}
                 </View>

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

                </View>
            </KeyboardAwareScrollView>
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
    color: Colors.textColor,
    padding: 10,
    borderWidth: 5,
    borderColor: '#FFF'
  },
  field: {
    margin: 10,
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: '500'
  }
})
