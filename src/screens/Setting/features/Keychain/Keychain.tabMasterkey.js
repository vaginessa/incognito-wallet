import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {Tabs} from '@components/core';
import {TABS} from '@screens/Setting/features/Keychain/Keychain.constant';
import Accounts from '@screens/Setting/features/Keychain/Keychain.accounts';
import {styled} from '@screens/Setting/features/Keychain/keychain.styled';
import KeychainSetting from '@screens/Setting/features/Keychain/Keychain.setting';

const TabMasterkey = () => {
  return (
    <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_KEY_ID} useTab1 styledTabs={{ paddingHorizontal: 25 }}>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_LIST_ID} label="Keychains">
        <ScrollView style={styled.wrapper}>
          <Accounts />
        </ScrollView>
      </View>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_SETTING_ID} label="Settings keychains">
        <ScrollView style={styled.wrapper}>
          <KeychainSetting />
        </ScrollView>
      </View>
    </Tabs>
  );
};

export default memo(TabMasterkey);
