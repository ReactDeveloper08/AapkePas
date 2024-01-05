import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderComponent from 'components/HeaderComponent';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, getData} from 'api/UserPreference';

// Styles
import basicStyles from 'styles/BasicStyles';

import CustomLoader from 'components/CustomLoader';

//shadow box
// import {Shadow} from 'react-native-neomorph-shadows';
// import {showToast} from 'components/CustomToast';

//redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from 'Redux/wiseword/wallet';

import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  signupInputWidth,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class CouponsScreens extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      message: '',
      isLoading: false,
      inner: false,
    };
  }
  componentDidMount() {
    this.showMyConsultations();
  }
  // handleLogin = () => {
  //   this.props.navigation.navigate('Login');
  // };
  showMyConsultations = async () => {
    this.setState({isLoading: true});
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/couponsList',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      this.setState({isLoading: false});
      if (success) {
        const {coupons} = response;
        this.setState({
          coupons,
          isLoading: false,
        });
      } else {
        this.setState({message, coupons: null, isLoading: false});
      }
    }
  };
  onInner = item => {
    this.setState({inner: true});
    this.listItem;
    const minimum = this.props.isMiniBalance;

    const {code, description} = item;

    this.props.navigation.navigate('AddMoney', {code, minimum});
    Alert.alert('Selected Coupon', description);
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  listItem = ({item}) => {
    let {inner} = this.state;
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.padding,
          basicStyles.alignCenter,
          styles.couponList,
        ]}>
        <View style={basicStyles.flexOne}>
          <Text style={{fontSize: textSize, color: '#333'}}>
            {item.description}
          </Text>
          <Text
            style={{
              fontSize: headingLargeSize,
              color: '#333',
              fontWeight: '700',
              marginVertical: wp(0.5),
            }}>
            {item.code}
          </Text>
          <Text style={{fontSize: textSize, color: '#333'}}>
            Valid Till {item.validTill}
          </Text>
        </View>
        <Touchable
          onPress={() => {
            this.onInner(item);
          }}>
          <Text style={[styles.button]}>Use it</Text>
        </Touchable>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="My Coupons"
          navAction="back"
        />
        <View style={basicStyles.mainContainer}>
          {this.state.coupons ? (
            <FlatList
              data={this.state.coupons}
              renderItem={this.listItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={{alignSelf: 'center'}}>{this.state.message}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  linearGradient: {
    height: hp(20),
    justifyContent: 'center',
    borderBottomLeftRadius: wp(5),
    borderBottomRightRadius: wp(5),
    position: 'relative',
    zIndex: 9,
    elevation: 5,
  },
  couponList: {
    backgroundColor: '#ff648a10',
    borderRadius: wp(2),
  },
  listContainer: {
    paddingHorizontal: wp(3),
  },
  contentContainerStyle: {
    paddingTop: 60,
    paddingBottom: 100,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 32,
  },
  divider: {
    height: 70,
  },
  button: {
    backgroundColor: '#ff648a',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    color: '#fff',
    borderRadius: wp(4),
    fontSize: textSize,
  },
  nueShadow: {
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1,
    shadowColor: '#99999980',
    shadowRadius: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: wp(94),
    height: 80,
    padding: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  separator: {
    height: wp(2),
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => ({
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isMiniBalance: transactionSelectors.isMiniBalance(state),
  isWalletSummary: transactionSelectors.isWalletSummary(state),
});

const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  getWalletSummary: transactionOperations.getWalletSummary,
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponsScreens);
