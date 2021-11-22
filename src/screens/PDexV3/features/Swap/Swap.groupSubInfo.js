import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import History from './Swap.orderHistory';
import { ROOT_TAB_SUB_INFO, TAB_HISTORY_ID } from './Swap.constant';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  return (
    <View style={styled.container}>
      <Tabs
        rootTabID={ROOT_TAB_SUB_INFO}
        styledTabs={styled.styledTabs}
        useTab1
      >
        <View tabID={TAB_HISTORY_ID} label="Swap history" onChangeTab={() => null}>
          <History />
        </View>
        <View tabID="" label="" />
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);
