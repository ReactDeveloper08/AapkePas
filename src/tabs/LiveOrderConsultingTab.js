import React, {PureComponent} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
// Components
import OrderHistoryTabListComponent from 'components/OrderHistoryTabListComponent';

class OrderAllTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chatData: [
        {
          status: 'Finished',
          icon: 'video',
          orderID: '#321',
          // userImage: astrologerImage,
          userName: 'Ankit Kumar Garg',
          orderTimeDate: '11:54 AM | 21 Dec. 2020',
          callDuration: '10 min.',
          clientPaid: '+200',
          totalEarning: '+100',
        },
        {
          status: 'Finished',
          icon: 'video',
          orderID: '#321',
          // userImage: astrologerImage,
          userName: 'Ankit Kumar Garg',
          orderTimeDate: '11:54 AM | 21 Dec. 2020',
          callDuration: '10 min.',
          clientPaid: '+200',
          totalEarning: '+100',
        },
        {
          status: 'Finished',
          icon: 'video',
          orderID: '#321',
          // userImage: astrologerImage,
          userName: 'Ankit Kumar Garg',
          orderTimeDate: '11:54 AM | 21 Dec. 2020',
          callDuration: '10 min.',
          clientPaid: '+200',
          totalEarning: '+100',
        },
        {
          status: 'Finished',
          icon: 'video',
          orderID: '#321',
          // userImage: astrologerImage,
          userName: 'Ankit Kumar Garg',
          orderTimeDate: '11:54 AM | 21 Dec. 2020',
          callDuration: '10 min.',
          clientPaid: '+200',
          totalEarning: '+100',
        },
        {
          status: 'Finished',
          icon: 'video',
          orderID: '#321',
          // userImage: astrologerImage,
          userName: 'Ankit Kumar Garg',
          orderTimeDate: '11:54 AM | 21 Dec. 2020',
          callDuration: '10 min.',
          clientPaid: '+200',
          totalEarning: '+100',
        },
      ],
    };
  }

  chatItem = ({item}) => (
    <OrderHistoryTabListComponent item={item} nav={this.props.nav} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  render() {
    return (
      <View style={basicStyles.container}>
        <FlatList
          data={this.state.chatData}
          renderItem={this.chatItem}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={this.itemSeparator}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

export default OrderAllTab;
