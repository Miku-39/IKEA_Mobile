import React, { Component } from 'react'
import { View, ScrollView, TextInput, StyleSheet, Text, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Fumi } from 'react-native-textinput-effects'
import DatePicker from 'react-native-datepicker'
import ReactNativePickerModule from 'react-native-picker-module'
import { CheckBox } from 'react-native-elements'
import DatePickerComponent from '../components/DatePicker'
import ImagePickerComponent from '../components/ImagePicker'

import { Images, Colors } from '../theme'

export default class VisitorScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       visitDate: this.props.ticket.visitDate,
       image: null
     }
  }

  updateFile = (uri) => {
    this.props.saveFile(uri)
    //this.setState({image: uri})
  }

  render () {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
              {this.props.ticketType == 'SERVICE' &&
                <View>
                <Fumi
                    label={'Место *'}
                    iconClass={Icon}
                    iconName={'room'}
                    iconColor={'#53565A'}
                    iconSize={20}
                    inputStyle={styles.fumiInput}
                    onChangeText={(text) => {this.props.updateField(text, 'whereHappened')}}
                />
                <TextInput
                  placeholder="Что сделать"
                  underlineColorAndroid='transparent'
                  style={styles.textInputStyle}
                  multiline={true}
                  scrollEnabled={true}
                  onChangeText={(text) => {this.props.updateField(text, 'whatHappened')}}
                  />
                </View>
              }
            </ScrollView>
      </View>
    )
  }
}const styles = StyleSheet.create({
    fumiInput: {
      color: '#53565A',
     marginBottom: Platform.OS === 'android' ? 7 : 0
   },
   textInputStyle:{
    height: 160,
    borderRadius: 10,
    backgroundColor : "#FFF",
    marginTop: 10,
    fontSize: 18,
    color: '#53565A',
    padding: 10,
    paddingTop: 10
  }
})
