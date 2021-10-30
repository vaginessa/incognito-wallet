import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {Tabs} from '@components/core';
import {TABS} from '@screens/Setting/features/Keychain/Keychain.constant';
import Accounts from '@screens/Setting/features/Keychain/Keychain.accounts';
import {styled} from '@screens/Setting/features/Keychain/keychain.styled';
import KeychainSetting from '@screens/Setting/features/Keychain/Keychain.setting';

const TabMasterless = () => {
  return (
    <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_LESS_ID} useTab1 styledTabs={{ paddingHorizontal: 25 }}>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_LESS_LIST_ID} label="Masterless">
        <ScrollView style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <Accounts />
        </ScrollView>
      </View>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_LESS_SETTING_ID} label="Settings masterless">
        <ScrollView style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <KeychainSetting />
        </ScrollView>
      </View>
    </Tabs>
  );
};

export default memo(TabMasterless);
