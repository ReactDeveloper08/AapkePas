import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const RefreshComponent = () => {
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    setLoading(true);

    delay(1500).then(() => setLoading(false));
  }, [loading]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              progressBackgroundColor="red"
              tintColor="red"
              refreshing={loading}
              onRefresh={loadMore}
            />
          }
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RefreshComponent;
