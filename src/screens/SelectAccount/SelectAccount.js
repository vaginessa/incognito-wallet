import React, { memo } from 'react';
import { View } from 'react-native';
import { Header } from '@src/components';
import { TABS } from '@screens/SelectAccount/SelectAccount.constant';
import { Tabs } from '@components/core';
import MasterKeys from '@screens/SelectAccount/SelectAccount.masterkeys';
import Masterless from '@screens/SelectAccount/SelectAccount.masterless';
import BtnInfo from '@screens/Setting/features/Keychain/BtnInfo';
import { View2 } from '@components/core/View';

const SelectAccount = () => {
  return (
    <View2 fullFlex>
      <Header title="Keychain" customHeaderTitle={<BtnInfo />} />
      <Tabs rootTabID={TABS.TAB_SELECT_ACCOUNT_ID} borderTop={false}>
        <View tabID={TABS.TAB_SELECT_ACCOUNT_MASTER_KEY_ID} label="Master keys">
          <MasterKeys />
        </View>
        <View tabID={TABS.TAB_SELECT_ACCOUNT_MASTER_LESS_ID} label="Masterless">
          <Masterless />
        </View>
      </Tabs>
    </View2>
  );
};

export default memo(SelectAccount);
