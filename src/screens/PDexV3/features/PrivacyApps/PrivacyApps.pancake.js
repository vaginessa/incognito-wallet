import React from 'react';
import TabSwap, {
  KEYS_PLATFORMS_SUPPORTED,
} from '@screens/PDexV3/features/Swap';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';

const PrivacyAppsPancake = () => {
  return (
    <>
      <Header title="pPancake" />
      <TabSwap isPrivacyApp exchange={KEYS_PLATFORMS_SUPPORTED.pancake} />
    </>
  );
};

PrivacyAppsPancake.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsPancake));
