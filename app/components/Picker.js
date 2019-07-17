import React from 'react';
import {  View,
          ScrollView,
          Text,
          StyleSheet,
          Picker,
          TouchableOpacity,
          Platform,
          NativeModules,
          LayoutAnimation } from 'react-native';
import { Colors } from '../theme'
import ReactNativePickerModule from 'react-native-picker-module'

export default class PickerComponent extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       selectedValue: null,
       selectedItem: this.props.itemsByIndex[0]
     }
  }

  render() {
    if(Platform.OS == 'android'){
      return (
          <View style={{marginBottom: 10}}>
            <Text style={styles.pickerLabel}>{this.props.label}</Text>
            <View style={styles.picker}>
              <Picker
                  selectedValue={this.state.selectedItem}
                  style={{height: 40, width: 180}}
                  onValueChange={(itemValue, itemIndex) =>{
                  this.props.onUpdate(itemValue, this.props.idByIndex[itemIndex]);
                  LayoutAnimation.spring();
                  this.setState({selectedItem: itemValue})}}>
                  {this.props.itemsByIndex.map(item => {return <Picker.Item label={item} value={item}/>})}
            </Picker>
          </View>
          </View>
    )} else {
      return(
        <View style={{marginBottom: 10}}>
        <Text style={styles.pickerLabel}>{this.props.label}</Text>
        <ReactNativePickerModule
                        pickerRef={e => pickerRef = e}
                        value={this.state.selectedValue}
                        title={this.props.label}
                        cancelButton='Отмена'
                        confirmButton='Выбрать'
                        items={this.props.itemsByIndex}
                        onValueChange={(value) => {
                             this.props.onUpdate(this.props.idByIndex[value]);
                             LayoutAnimation.spring();
                             this.setState({selectedValue: value })
                             this.setState({selectedItem: this.props.itemsByIndex[value]})
                        }}/>
        <TouchableOpacity onPress={() => {pickerRef.show()}} style={styles.picker}>
          <Text style={styles.pickerText}>{this.state.selectedItem}</Text>
        </TouchableOpacity>
        </View>
    )}
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
    margin: 8,
    color: Colors.textColor
   }
})
