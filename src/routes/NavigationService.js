import {NavigationActions, StackActions} from 'react-navigation';
import * as React from 'react';

export const nsSetTopLevelNavigator = React.createRef();

export const isReadyRef = React.createRef();

// export function nsSetTopLevelNavigator(navigatorRef) {
//   topLevelNavigator.current? = navigatorRef;
// }

// navigate action
export function nsNavigate(routeName, params = undefined) {
  StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate(routeName)],
    key: null,
  });
  // resetData(routeName);
  const navigateAction = NavigationActions.navigate({routeName, params});
  console.log('yes', nsSetTopLevelNavigator);
  nsSetTopLevelNavigator.current?.dispatch(navigateAction);
}

function resetData(routeName) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate(routeName)],
    key: null,
  });

  nsSetTopLevelNavigator.current?.dispatch(resetAction);
}

// stack actions
export function nsPush(routeName, params = undefined) {
  if (nsSetTopLevelNavigator) {
    const pushAction = StackActions.push({routeName, params});
    nsSetTopLevelNavigator.current?.dispatch(pushAction);
  }
}

export function nsPop(n = 1) {
  if (nsSetTopLevelNavigator) {
    const popAction = StackActions.pop({n});
    nsSetTopLevelNavigator.current?.dispatch(popAction);
  }
}
