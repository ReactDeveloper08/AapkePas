import React, {PureComponent} from 'react';
import {View, StyleSheet, SafeAreaView, Dimensions} from 'react-native';

//tab
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

// Tab Screens
import OrderAllTab from 'tabs/OrderAllTab';
import OrderMissedTab from 'tabs/OrderMissedTab';
import OrderUpcomingTab from 'tabs/OrderUpcomingTab';

import OrderFinishedTab from 'tabs/OrderFinishedTab';

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
    const missed = this.props.navigation.getParam('missed');

    missed === 'missed'
      ? (this.tabView = {
          index: 0,
          routes: [
            {key: 'Missed', title: 'Missed'},
            {key: 'All', title: 'All'},
            {key: 'Upcoming', title: 'Upcoming'},
            // {key: 'Ongoing', title: 'Ongoing'},
            {key: 'Finished', title: 'Finished'},
          ],
        })
      : (this.tabView = {
          index: 0,
          routes: [
            {key: 'All', title: 'All'},
            {key: 'Missed', title: 'Missed'},
            {key: 'Upcoming', title: 'Upcoming'},
            // {key: 'Ongoing', title: 'Ongoing'},
            {key: 'Finished', title: 'Finished'},
          ],
        });

    this.state = {
      tabView: this.tabView,
    };

    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap Routing
    const {navigation} = this.props;
    const AllRoute = () => (
      <OrderAllTab
        nav={navigation}
        handleSendOtpPopUp={this.handleSendOtpPopUp}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );
    const MissedRoute = () => (
      <OrderMissedTab
        handleTabChange={this.handleTabIndexChange}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );
    const UpcomingRoute = () => (
      <OrderUpcomingTab
        handleTabChange={this.handleTabIndexChange}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );
    // const OngoingRoute = () => (
    //   <OrderOngoingTab
    //     handleTabChange={this.handleTabIndexChange}
    //     handleProcessingLoader={this.handleProcessingLoader}
    //   />
    // );
    const FinishedRoute = () => (
      <OrderFinishedTab
        handleTabChange={this.handleTabIndexChange}
        handleProcessingLoader={this.handleProcessingLoader}
      />
    );

    missed.missed === 'missed'
      ? (this.sceneMap = SceneMap({
          Missed: MissedRoute,
          All: AllRoute,
          Upcoming: UpcomingRoute,
          // Ongoing: OngoingRoute,
          Finished: FinishedRoute,
        }))
      : (this.sceneMap = SceneMap({
          All: AllRoute,
          Missed: MissedRoute,
          Upcoming: UpcomingRoute,
          // Ongoing: OngoingRoute,
          Finished: FinishedRoute,
        }));
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
      activeColor={'#fff'}
      inactiveColor="#fff"
    />
  );

  render() {
    const {state, sceneMap, handleTabIndexChange, initialLayout} = this;
    const {tabView} = state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.lightBackgroundColor]}>
        <HeaderComponents
          headerTitle="History Order"
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
    backgroundColor: '#45aae2',
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
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryOrder;
