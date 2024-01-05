import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';

// Icons
import ic_call from 'assets/icons/ic_call.png';

export default class PopupDemoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.parentView = null;
  }

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target) {
      this.props.closePopup();
    }
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleReview = () => {
    this.props.nav.push('Thankyou');
  };

  manageCallData = async () => {
    try {
      const id = this.props.id;
      console.log('the Expert ID====' + id);
      const params = {
        expertId: id,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/callToExpert',
        params,
        true,
        false,
      );
      if (response) {
        this.props.nav.push('Thankyou');
      }
    } catch (error) {
      alert(error);
    }
  };

  render() {
    const {item} = this.props;

    const {walletBalance, charges, maxDuration, contactNumber, name} = item;
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <View style={styles.popupHeader}>
            <Image
              source={ic_call}
              resizeMode="cover"
              style={styles.headerIcon}
            />
            <Text style={styles.popupText}>{name}</Text>
          </View>

          <View style={styles.popupBody}>
            <View style={styles.row}>
              <Text style={styles.title}>Per Min Consultation Charge:</Text>
              <Text style={styles.detail}>₹ {charges}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Available Balance:</Text>
              <Text style={styles.detail}>₹ {walletBalance}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Max Call Duration:</Text>
              <Text style={styles.detail}>{maxDuration}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>You will get a call on</Text>
              <Text style={styles.detail}>{contactNumber}</Text>
            </View>
          </View>

          <View style={styles.popupFooter}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={this.manageCallData}>
              <Text style={styles.buttonText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: wp(3.5),
  },
  detail: {
    fontSize: wp(3.5),
    color: '#ff648a',
  },
  popupBody: {
    padding: wp(2),
  },
  popupText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '700',
  },
  popupHeader: {
    backgroundColor: '#ff648a',
    flexDirection: 'row',
    alignItems: 'center',
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    padding: wp(2),
  },
  headerIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  row: {
    paddingVertical: wp(1),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  popupFooter: {
    flexDirection: 'row',
  },
  callButton: {
    backgroundColor: '#ff648a',
    flex: 1,
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  crossButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#f2f1f1',
    position: 'absolute',
    right: -10,
    top: -10,
    zIndex: 9,
  },
  crossIcon: {
    height: wp(3),
    aspectRatio: 1 / 1,
  },
});
