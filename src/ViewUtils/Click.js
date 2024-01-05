import React from 'react';
import debounce from 'lodash.debounce'; // 4.0.8
import {TouchableOpacity, TouchableHighlight} from 'react-native';
export const withPreventDoubleClick = WrappedComponent => {
  class PreventDoubleClick extends React.PureComponent {
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    };

    onPress = debounce(this.debouncedOnPress, 1000, {
      leading: true,
      trailing: false,
    });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return PreventDoubleClick;
};

export const Touchable = withPreventDoubleClick(TouchableOpacity);
export const TouchableHigh = withPreventDoubleClick(TouchableHighlight);
