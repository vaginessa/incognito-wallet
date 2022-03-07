import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import History from './Swap.orderHistory';
import {
  ROOT_TAB_SUB_INFO,
  TAB_HISTORY_ID,
  TAB_REWARD_HISTORY_ID,
} from './Swap.constant';
import RewardHistory from './Swap.rewardHistory';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  const navigation = useNavigation();
  return (
    <View style={styled.container}>
      <Tabs rootTabID={ROOT_TAB_SUB_INFO}>
        <View
          tabID={TAB_HISTORY_ID}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History />
        </View>
        {navigation?.state?.routeName === routeNames.PrivacyAppsPancake ||
        navigation?.state?.routeName === routeNames.PrivacyAppsUni ||
        navigation?.state?.routeName === routeNames.PrivacyAppsCurve ? (
          // eslint-disable-next-line react/jsx-indent
            <View tabID={TAB_REWARD_HISTORY_ID} label="Trading rewards">
              <RewardHistory />
            </View>
          ) : (
            <View tabID="" label="">
              <View />
            </View>
          )}
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);
