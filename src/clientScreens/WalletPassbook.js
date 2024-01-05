import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Tab Screens
import WalletExpense from './WalletExpense';
import WalletIncome from './WalletIncome';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';

// Icons

export default class ExpensesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabView: {
        index: 0,
        routes: [
          {key: 'Income', title: 'Expense', icon: 'wallet'},
          {key: 'Expense', title: 'Balance', icon: 'profile'},
        ],
      },
    };

    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap routes
    const {navigation} = this.props;
    const IncomeRoute = () => (
      <WalletExpense
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );
    const ExpenseRoute = () => (
      <WalletIncome
        nav={navigation}
        handleTabChange={this.handleTabIndexChange}
      />
    );

    this.sceneMap = SceneMap({
      Income: IncomeRoute,
      Expense: ExpenseRoute,
    });
  }

  handleTabIndexChange = index => {
    const tabView = {
      ...this.state.tabView,
      index,
    };
    this.setState({tabView});
  };

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBarStyle}
      activeColor
    />
  );

  handleAddExpenses = () => {
    this.props.navigation.push('Vault');
  };

  render() {
    const {sceneMap, handleTabIndexChange, initialLayout} = this;
    const {tabView} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.expenseContainer}>
          <HeaderComponent
            navAction="back"
            headerTitle="Wallet Passbook"
            showGradient
            nav={this.props.navigation}
          />

          <View style={styles.expensesTabContainer}>
            <TabView
              initialLayout={initialLayout}
              navigationState={tabView}
              renderScene={sceneMap}
              onIndexChange={handleTabIndexChange}
              renderTabBar={this.renderTabBar}
            />
          </View>
          {/* <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleAddExpenses}
            underlayColor="transparent">
            <Image
              source={ic_add}
              resizeMode="cover"
              style={styles.addButtonText}
            />
          </TouchableOpacity> */}
          <FooterComponent nav={this.props.navigation} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
    //backgroundColor: '#ff648a',
  },
  bgContainer: {
    flex: 1,
  },
  expenseContainer: {
    flex: 1,
  },

  pieContainer: {
    height: hp(32),
    alignItems: 'center',
    justifyContent: 'center',
  },

  expensesTabContainer: {
    flex: 1,
    borderRadius: 15,
  },

  tabBarIndicator: {
    backgroundColor: '#de4369',
    height: '100%',
    //borderTopLeftRadius: hp(4),
    //borderBottomLeftRadius: hp(4),

    borderRadius: hp(4),
  },
  tabBarStyle: {
    //backgroundColor: '#066190',
    backgroundColor: '#ff648a',
    marginTop: hp(2),
    marginLeft: wp(2),
    marginRight: wp(2),
    borderRadius: hp(4),
  },
  tabBarLabel: {
    color: '#fff',
    //color: '#ff648a',
    fontSize: wp(3),
    textTransform: 'capitalize',
    borderRadius: 50,
  },
  addButton: {
    backgroundColor: '#056394',
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    right: 15,
  },
  addButtonText: {
    height: 25,
    aspectRatio: 1 / 1,
  },
});
