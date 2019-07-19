import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Colors } from '../theme'

export default class DatePickerComponent extends React.Component {
  constructor(props) {
     super(props);
  }

  render() {
    const minDate = new Date()
    const maxDate = new Date()
    minDate.setFullYear(minDate.getFullYear()-1)
    maxDate.setFullYear(minDate.getFullYear()+2)

    return (
      <View style={{marginBottom: 10}}>
          <Text style={styles.pickerLabel}>{this.props.label}</Text>
          <DatePicker
              style={{ marginLeft: 10, alignSelf: 'center', height: 40, width: 210}}
              date={this.props.date}
              mode="date"
              format="YYYY-MM-DD"
              minDate={minDate}
              minuteInterval={5}
              locale="ru-RU"
              maxDate={maxDate}
              confirmBtnText="Подтвердить"
              cancelBtnText="Отмена"
              placeholder={this.props.placeholder}
              customStyles={{
                  dateIcon: {
                      width: 0
                  },
                  dateInput: {
                      borderRadius: 20,
                      height: 40,
                      width: 200,
                      borderWidth: 0,
                      backgroundColor: Colors.buttonColor
                  }
              }}
              onDateChange={this.props.onUpdate}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
   pickerLabel: {
     fontWeight: 'bold',
     color: Colors.textColor,
     fontSize: 16,
     alignSelf: 'center',
     textAlign: 'center',
     margin: 5
   }
})
