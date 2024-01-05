import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  TouchableHighlight,
} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerSelection: 'Default value!',
      pickerDisplayed: false,
    };
  }

  setPickerValue(newValue) {
    this.setState({
      pickerSelection: newValue,
    });

    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      pickerDisplayed: !this.state.pickerDisplayed,
    });
  }

  render() {
    const pickerValues = [
      {
        title: 'Chicken',
        value: 'chicken',
      },
      {
        title: 'Eggs',
        value: 'eggs',
      },
      {
        title: 'Vegetables',
        value: 'vegetables',
      },
    ];

    return (
      <View style={styles.container}>
        <Text>The default value is {this.state.pickerSelection}</Text>
        <Button onPress={() => this.togglePicker()} title={'Select a value!'} />
        {/* <Picker
          style={{ backgroundColor: '#fafafa', position: 'absolute', bottom: 0, left: 0, right: 0 }}
          selectedValue={ this.state.pickerSelection }
          onValueChange={(itemValue, itemIndex) => this.setState({ pickerSelection: itemValue})}>
          <Picker.Item label="Chicken" value="chicken" />
          <Picker.Item label="Eggs" value="eggs" />
          <Picker.Item label="Vegetables" value="vegetables" />
        </Picker> */}

        <Modal
          visible={this.state.pickerDisplayed}
          animationType={'slide'}
          transparent={true}>
          <View
            style={{
              margin: 20,
              padding: 20,
              backgroundColor: '#efefef',
              bottom: 20,
              left: 20,
              right: 20,
              alignItems: 'center',
              position: 'absolute',
            }}>
            <Text>Please pick a value</Text>
            {pickerValues.map((value, index) => {
              return (
                <TouchableHighlight
                  key={index}
                  onPress={() => this.setPickerValue(value.value)}
                  style={{paddingTop: 4, paddingBottom: 4}}>
                  <Text>{value.title}</Text>
                </TouchableHighlight>
              );
            })}

            <TouchableHighlight
              onPress={() => this.togglePicker()}
              style={{paddingTop: 4, paddingBottom: 4}}>
              <Text style={{color: '#999'}}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
