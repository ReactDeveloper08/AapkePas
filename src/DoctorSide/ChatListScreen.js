import React, {PureComponent} from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';
import ChatUserListComponent from 'components/ChatUserListComponent';

class ChatList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = ({item}) => (
    <ChatUserListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => (
    <View style={{height: 1, backgroundColor: '#e9e6b9'}} />
  );

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.offWhiteBgColor]}>
        <HeaderComponents headerTitle="Chat" nav={this.props.navigation} />
        <View style={[basicStyles.mainContainer]}>
          <FlatList
            data={this.state.listData}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            // horizontal={true}
            // numColumns="4"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default ChatList;
