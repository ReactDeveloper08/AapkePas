import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class EditTemplatePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
    };

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.heading}>Edit Template</Text>

          <TextInput
            style={styles.input}
            placeholder="Vender ID"
            placeholderTextColor="#666"
            // maxLength={10}
            //keyboardType="number-pad"
            multiline
            // numberOfLines={2}
            value={this.state.vendorCode}
            onChangeText={this.handleCodeChange}
          />

          <TouchableOpacity
            style={styles.applyButton}
            onPress={this.handleApply}
            underlayColor="#fd6c3380">
            <Text style={styles.applyButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(86),
    backgroundColor: 'white',
    padding: wp(5),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  applyButton: {
    backgroundColor: '#fd6c33',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(1),
    alignItems: 'center',
    // marginTop: 'auto',
    // marginBottom: hp(2),
    // alignSelf: 'center',
    marginTop: wp(3),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: wp(3.5),
  },
  input: {
    height: hp(10),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
  },
});

export default EditTemplatePopup;
