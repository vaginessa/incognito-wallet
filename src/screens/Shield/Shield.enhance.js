import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { withTokenVerified } from '@src/components/Token';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import { selectedPrivacySelector } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { compose } from 'recompose';
import { PRV_ID } from '@src/screens/DexV2/constants';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const { allTokens, isTokenSelectable } = props;
  const getPrivacyDataByTokenID = useDebounceSelector(
    selectedPrivacySelector.getPrivacyDataByTokenID,
  );
  const availableTokens = React.useMemo(() => {
    return allTokens
      .map((token) => getPrivacyDataByTokenID(token?.tokenId))
      .filter((token) => token?.isDeposable);
  }, [allTokens.length]);
  const handleWhyShield = () => navigation.navigate(routeNames.WhyShield);
  const handleShield = async (item) => {
    try {
      if (!isTokenSelectable(item?.tokenId)) {
        return;
      }
      if (item?.tokenId === PRV_ID) {
        navigation.navigate(routeNames.ShieldGenQRCode, {
          tokenShield: item,
        });
      } else {
        navigation.navigate(routeNames.ChooseNetworkForShield, {
          tokenShield: item,
        });
      }
    } catch (error) {
      console.debug('SHIELD ERROR', error);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          availableTokens,
          handleWhyShield,
          handleShield,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  allTokens: PropTypes.array.isRequired,
};
export default compose(
  withLayout_2,
  (Comp) => (props) => <Comp {...{ ...props, onlyPToken: true }} />,
  withTokenSelect,
  enhance,
  withTokenVerified,
);
