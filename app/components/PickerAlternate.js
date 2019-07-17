import { Picker } from 'react-native-woodpicker'
import React from 'react';

[...]

export default class ExampleApp extends React.Component {
  constructor(props) {
     super(props);
  }

  state = {
    pickedData: null
  };

  data = [
    { label: "DataCat", value: 1 },
    { label: "DataDog", value: 2 },
    { label: "DataSnake", value: 3 },
    { label: "DataPlatypus", value: 4 },
    { label: "DataWhale", value: 5 }
  ];

  handlePicker = data => {
    this.setState({ pickedData: data });
  };

  render() {
    return (
      <View>
        <Picker
          onValueChange={this.handlePicker}
          items={this.data}
          title="Data Picker"
          placeholder="Select Data"
          value={this.state.pickedData}
          //androidPickerMode="dropdown"
          //isNullable
        />
      </View>
    );
  }
}
