import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {Tabs, View} from '@components/core';
import {TABS} from '@screens/Setting/features/Keychain/Keychain.constant';
import Accounts from '@screens/Setting/features/Keychain/Keychain.accounts';
import {styled} from '@screens/Setting/features/Keychain/keychain.styled';
import KeychainSetting from '@screens/Setting/features/Keychain/Keychain.setting';
import globalStyled from '@src/theme/theme.styled';

const TabMasterkey = () => {
  return (
    <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_KEY_ID} useTab1 styledTabs={{ ...globalStyled.defaultPadding4 }}>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_LIST_ID} label="Keychains" style={styled.borderTop}>
        <ScrollView style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <Accounts />
        </ScrollView>
      </View>
      <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_SETTING_ID} label="Actions" style={styled.borderTop}>
        <ScrollView style={styled.wrapper} showsVerticalScrollIndicator={false}>
          <KeychainSetting />
        </ScrollView>
      </View>
    </Tabs>
  );
};

export default memo(TabMasterkey);
