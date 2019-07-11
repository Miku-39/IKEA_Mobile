import React, { Component } from 'react'
import { View, ScrollView, Text, StyleSheet, Picker, TouchableOpacity, Platform, Image } from 'react-native';
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

  updateImage = (uri) => {
    this.props.saveFile(uri)
    this.setState({image: uri})
  }

  render () {
    androidMargin = Platform.OS === 'android' ? 7 : 0
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <ScrollView>
                  <Fumi
                      label={'ФИО посетителя'}
                      iconClass={Icon}
                      iconName={'person'}
                      iconColor={'#53565A'}
                      iconSize={20}
                      inputStyle={{ color: '#53565A', marginBottom: androidMargin }}
                      onChangeText={this.props.updateVisitor}
                  />
              { this.props.ticketType == 'CARD' &&
                  <ImagePickerComponent
                    onChoose={this.updateImage}/>
              }
            </ScrollView>
      </View>
    )
  }
}
