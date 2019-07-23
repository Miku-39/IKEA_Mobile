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
import { Images, Colors } from '../theme'
import DatePickerComponent from '../components/DatePicker'
import PickerComponent from '../components/PickerAlternate'

import ReactNativePickerModule from 'react-native-picker-module'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class GoodsTicketEditor extends Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedParking: this.props.initialParking,
       fieldsVisible: {
         note: (this.props.ticketType == 'GOODS')
       },
       longTerm: false,
       allFields: false
     }
  }

  setVisible = (field) => {
    state = this.state
    state[field] = !state[field]
    if(field == 'longTerm'){
      this.props.updateField(state[field], field);
    }
    LayoutAnimation.easeInEaseOut();
    this.setState(state)
  }

  updateField = (data, field) => {
    this.props.updateField(data, field);
    LayoutAnimation.easeInEaseOut();
    console.log(data)
    fields = this.state
    fields[field] = data

    var fieldsVisible = {
      carNumber: ((fields.khimkiRequestType == '4022223527000') || (fields.khimkiRequestType == '4022223531000')),
      parkingPlace: fields.khimkiRequestType == '4022223527000',
      note: true
    }

    fields['fieldsVisible'] = fieldsVisible
    this.setState(fields);
    console.log(fields)
    console.log(this.state.fieldsVisible);
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
                          <PickerComponent
                            isHighlighted={this.props.fieldsHighlights.khimkiRequestType}
                            label="Тип заявки *"
                            items={this.props.goodsTypes}
                            onUpdate={(text) => {this.updateField(text, 'khimkiRequestType')}}/>
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
                          onChangeText={(text) => {this.updateField(text, 'visitorFullName')}}/>
                      <Fumi
                          style={[styles.fumiStyle, {borderColor: this.props.fieldsHighlights.companyName ? Colors.accentColor : '#FFF'}]}
                          label={'Компания-Поставщик *'}
                          iconClass={Icon}
                          iconName={'person'}
                          iconColor={Colors.textColor}
                          iconSize={20}
                          labelStyle={styles.fumiLabel}
                          inputStyle={styles.fumiInput}
                          onChangeText={(text) => {this.updateField(text, 'companyName')}}/>

                  </View>

                  { this.state.fieldsVisible.carNumber &&
                  <View style={styles.fieldsContainer}>
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
                      </View>
                      {this.state.fieldsVisible.parkingPlace &&
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
                      }
                  </View>
                }
                {this.state.fieldsVisible.note &&
                  <View>
                  <View style={styles.fieldsContainer}>
                    <TextInput
                      placeholder="Данные мат. ценностей *"
                      underlineColorAndroid='transparent'
                      style={[styles.textInputStyle, {borderColor: this.props.fieldsHighlights.materialValuesData ? Colors.accentColor : '#FFF'}]}
                      multiline={true}
                      scrollEnabled={true}
                      onChangeText={(text) => {this.props.updateField(text, 'materialValuesData')}}
                      />
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