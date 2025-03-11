import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';

export default function LoadingSmall() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
