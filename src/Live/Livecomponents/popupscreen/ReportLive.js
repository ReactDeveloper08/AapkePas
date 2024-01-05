import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from '../Style';

import {BASE_URL, makeRequest} from 'api/ApiInfo';

import showToast from 'components/CustomToast';

class ReportLive extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
      enableButton: true,
      experts: {},
    };

    this.parentView = null;
  }

  componentDidMount() {
    this.reportData();
  }
  reportData = async () => {
    try {
      const response = await makeRequest(
        BASE_URL + 'api/Customer/reportsCategory',
        null,
      );
      if (response) {
        const {success, message} = response;

        if (success) {
          const {experts} = response;
          this.setState({experts});
        } else {
          console.log('the output message', message);
        }
      }
    } catch (e) {}
  };

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
  handleAllSet = async repoId => {
    // this.setState({enableButton: false});
    const {expertId, channelId} = this.props;
    const params = {
      reprtCategoryId: repoId,
      expertId: expertId,
      channelId: channelId,
    };

    const response = await makeRequest(
      BASE_URL + 'api/Customer/astroReport',
      params,
      true,
      false,
    );

    if (response) {
      const {success, message} = response;
      if (success) {
        showToast(message);
        this.props.closePopup();
      } else {
        showToast(message);
        this.props.closePopup();
      }
    }
  };
  rechargeWallet = () => {
    this.props.nav.navigate('RechargeWallet');
  };

  renderItem = ({item}) => {
    const repoId = item.reportCategoryId;
    return (
      <TouchableOpacity onPress={() => this.handleAllSet(repoId)}>
        <View style={styles.popupButton2}>
          <Text style={styles.popupButtonText2}>{item.reportCategory}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text
            style={{fontWeight: '700', marginTop: wp(2), marginBottom: wp(3)}}>
            Report
          </Text>
          <View style={styles.listContainerMain}>
            <View style={styles.listContainer}>
              <Text style={{flex: 1}}>
                What is Going with this post or message?
              </Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={{flex: 1}}>
                Please help up understand, we'll deal with it
              </Text>
            </View>
          </View>
          <FlatList
            data={this.state.experts}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            inverted
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }
}

export default ReportLive;
