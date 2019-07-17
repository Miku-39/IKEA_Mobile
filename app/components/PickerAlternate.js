import { Picker } from 'react-native-woodpicker'
import React from 'react';
import {  View,
          StyleSheet,
          Text,
          NativeModules } from 'react-native';
import { Colors } from '../theme'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class PickerComponent extends React.Component {
  constructor(props) {
     super(props);
  }

  state = {
    pickedData: null
  };

  data = [{label: 'Не выбрано', value: ''}].concat(this.props.items.map(item => {return {label: item.name, value: item.id}}))

  handlePicker = data => {
    LayoutAnimation.easeInEaseOut()
    this.setState({ pickedData: data });
  };

  render() {
    return (
      <View style={{marginBottom: 10}}>
        <Text style={styles.pickerLabel}>{this.props.label}</Text>
        <View style={styles.picker}>
          <Picker
            style={{height: 40, width: 200}}
            onValueChange={this.handlePicker}
            items={this.data}
            title={this.props.label}
            placeholder="Выберите"
            value={this.state.pickedData}
            onItemChange={(item) => {this.props.onUpdate(item.value)}}
            placeholderStyle={styles.pickerText}
            androidPickerMode="dropdown"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    color: Colors.textColor
   }
})
