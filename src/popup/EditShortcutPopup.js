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
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/CustomLoader';
class EditShortcutPopup extends PureComponent {
  constructor(props) {
    super(props);
    const {userName} = this.props.item;
    this.state = {
      vendorCode: userName,
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

  handleApply = async () => {
    this.setState({isLoading: true});
    const {templateId} = this.props.item;

    const params = {
      templateId,
      template: this.state.vendorCode,
    };
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/editTemplate',
          params,
          true,
          false,
        ),
      );
      reject(response);
    })
      .then(response => {
        const {message} = response;
        this.setState({isLoading: false});
        const refresh = this.props.refresh;
        refresh(message);
        showToast(message);
      })
      .catch(message => {
        this.setState({message, isLoading: false});
      });
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.heading}>Edit Shortcut</Text>

          <TextInput
            style={styles.input}
            placeholder="How are you and how may I help you"
            placeholderTextColor="#999"
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
            underlayColor="#ff638b80">
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
    backgroundColor: '#4faee4',
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
    height: hp(15),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    color: '#333',
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
  },
});

export default EditShortcutPopup;
