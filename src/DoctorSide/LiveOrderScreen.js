import React, {PureComponent} from 'react';
import {View, StyleSheet, SafeAreaView, Dimensions} from 'react-native';

//tab
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

// Tab Screens
import LiveOrderConsultingTab from 'tabs/LiveOrderConsultingTab';
import LiveOrderGiftsTab from 'tabs/LiveOrderGiftsTab';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

class HistoryOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabView: {
        index: 0,
        routes: [
          {key: 'Consulting', title: 'Consulting'},
          {key: 'Gift', title: 'Gifts'},
        ],
      },
    };

    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap Routing
    const {navigation} = this.props;
    const ConsultingRoute = () => (
      <LiveOrderConsultingTab
        nav={navigation}
        handleSendOtpPopUp={this.handleSendOtpPopUp}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );
    const GiftRoute = () => (
      <LiveOrderGiftsTab
        handleTabChange={this.handleTabIndexChange}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );

    this.sceneMap = SceneMap({
      Consulting: ConsultingRoute,
      Gift: GiftRoute,
    });
  }

  handleTabIndexChange = index => {
    const tabView = {...this.state.tabView, index};
    this.setState({tabView});
  };

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBarStyle}
      activeColor={'#fffcd5'}
      inactiveColor="#fff"
    />
  );

  render() {
    const {state, sceneMap, handleTabIndexChange, initialLayout} = this;
    const {tabView} = state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.offWhiteBgColor]}>
        <HeaderComponents
          headerTitle="Live Order"
          nav={this.props.navigation}
        />
        <View style={basicStyles.mainContainer}>
          <TabView
            initialLayout={initialLayout}
            navigationState={tabView}
            renderScene={sceneMap}
            onIndexChange={handleTabIndexChange}
            renderTabBar={this.renderTabBar}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    // marginBottom: hp(2),
    backgroundColor: '#bc0f17',
    padding: 0,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: wp(3.3),
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    width: wp(25),
    textAlignVertical: 'center',
    height: '100%',
  },

  tabBarIndicator: {
    backgroundColor: '#fffcd5',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryOrder;
