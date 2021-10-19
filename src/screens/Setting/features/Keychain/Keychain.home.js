import React, {memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {currentMasterKeySelector, masterlessKeyChainSelector} from '@src/redux/selectors/masterKey';
import TabMasterless from '@screens/Setting/features/Keychain/Keychain.tabMasterless';
import TabMasterKey from '@screens/Setting/features/Keychain/Keychain.tabMasterkey';
import {Header} from '@src/components';
import RightBtn from '@screens/Setting/features/Keychain/RightBtn';
import BtnInfo from '@screens/Setting/features/Keychain/BtnInfo';

const Keychain = () => {
  const masterKey = useSelector(currentMasterKeySelector);
  const masterlessKey = useSelector(masterlessKeyChainSelector);
  const isMasterless = React.useMemo(() => (
    masterKey === masterlessKey
  ), [masterKey, masterlessKey]);
  console.log('isMasterless', isMasterless);

  const Content = React.useMemo(() => {
    if (isMasterless) return <TabMasterless isMasterless={isMasterless} />;
    return <TabMasterKey isMasterless={isMasterless} />;
  }, [isMasterless]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Keychain"
        style={{ marginHorizontal: 25 }}
        rightHeader={<RightBtn title={masterKey.name} />}
        customHeaderTitle={<BtnInfo />}
      />
      {Content}
    </View>
  );
};

Keychain.propTypes = {};

export default memo(Keychain);
