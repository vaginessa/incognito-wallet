import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { availableTokensSelector } from '@src/redux/selectors/shared';
import { useSearchBox } from '@src/components/Header';
import { handleFilterTokenByKeySearch } from '@src/components/Token';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { useTokenList } from './Token.useEffect';

const enhance = (WrappedComp) => (props) => {
  const availableTokens =
    props?.availableTokens || useSelector(availableTokensSelector);
  let verifiedTokens = [];
  let unVerifiedTokens = [];
  availableTokens.map((token) =>
    token?.isVerified
      ? verifiedTokens.push(token)
      : unVerifiedTokens.push(token),
  );
  const [toggleUnVerified, onToggleUnVerifiedTokens] = useTokenList();
  const [_verifiedTokens, keySearch, handleFilterData] = useSearchBox({
    data: verifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({ tokens: verifiedTokens, keySearch }),
  });
  const [_unVerifiedTokens, _keySearch, _handleFilterData] = useSearchBox({
    data: unVerifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      }),
  });

  React.useEffect(() => {
    const __verifiedTokens = handleFilterTokenByKeySearch({
      tokens: verifiedTokens,
      keySearch,
    });
    handleFilterData(__verifiedTokens);
    if (toggleUnVerified) {
      const __unVerifiedTokens = handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      });
      _handleFilterData(__unVerifiedTokens);
    }
  }, [availableTokens]);

  const tokensFactories = [
    {
      data: _verifiedTokens,
      visible: !!keySearch,
      styledListToken: { paddingTop: 0 },
    },
    {
      data: _unVerifiedTokens,
      visible: !!keySearch && toggleUnVerified,
      styledListToken: { paddingTop: 15 },
    },
    {
      data: orderBy(_verifiedTokens.concat(_unVerifiedTokens.filter(item => item.isFollowed), 'isFollowed', 'desc')),
      visible: !keySearch,
      styledListToken: { paddingTop: 15 },
    }
  ];

  React.useEffect(() => {
    if (toggleUnVerified && !keySearch) {
      onToggleUnVerifiedTokens();
    }
  }, [keySearch]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          tokensFactories,
          toggleUnVerified,
          onToggleUnVerifiedTokens,
          keySearch
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  availableTokens: PropTypes.array.isRequired,
};

export default enhance;
