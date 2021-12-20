import React, {memo} from 'react';
import {Tabs, View, ScrollViewBorder} from '@components/core';
import {TABS} from '@screens/Setting/features/Keychain/Keychain.constant';
import Accounts from '@screens/Setting/features/Keychain/Keychain.accounts';
import {styled} from '@screens/Setting/features/Keychain/keychain.styled';
import KeychainSetting from '@screens/Setting/features/Keychain/Keychain.setting';

const TabMasterkey = () => {
  return (
    <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_KEY_ID} borderTop={false}>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_LIST_ID} label="Keychains">
        <ScrollViewBorder style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <Accounts />
        </ScrollViewBorder>
      </View>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_SETTING_ID} label="Actions">
        <ScrollViewBorder style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <KeychainSetting />
        </ScrollViewBorder>
      </View>
    </Tabs>
  );
};

export default memo(TabMasterkey);
