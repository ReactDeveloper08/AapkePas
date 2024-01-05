import React, {PureComponent} from 'react';
import {View, FlatList} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
// Components
import LiveOrderGiftListComponent from 'components/LiveOrderGiftListComponent';

class LiveOrderGiftTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  chatItem = ({item}) => (
    <LiveOrderGiftListComponent item={item} nav={this.props.nav} />
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

export default LiveOrderGiftTab;
