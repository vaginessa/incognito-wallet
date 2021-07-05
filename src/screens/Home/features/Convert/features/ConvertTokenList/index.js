import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { Header, LoadingContainer } from '@src/components';
import { compose } from 'recompose';
import enhance from '@screens/Home/features/Convert/features/ConvertTokenList/enhance';
import { useSelector } from 'react-redux';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';
import { styled } from '@components/Token/Token.styled';
import { NormalText } from '@components/Token/Token';
import { TokenVerifiedIcon } from '@components/Icons';
import { balanceStyled } from '@screens/Wallet/features/Detail/Detail.styled';
import { FONT } from '@src/styles';
import formatUtils from '@utils/format';
import PropTypes from 'prop-types';
import { selectedPrivacySelector } from '@src/redux/selectors';
import BigNumber from 'bignumber.js';
import { ButtonBasic } from '@components/Button';
import isEmpty from 'lodash/isEmpty';
import { ActivityIndicator, Image } from '@components/core';
import noTransaction from '@assets/images/icons/shield.png';
import { styles } from '@screens/Wallet/features/HistoryToken/HistoryToken.empty';
import {withLayout_2} from '@components/Layout';

const Item = React.memo(({ item, maxSize, index, loading }) => {
  const { tokenID, unspentCoins } = item;
  const token = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(tokenID);

  const balance = React.useMemo(() => {
    return unspentCoins.reduce((prev, coin) => {
      return prev.plus(coin.Value);
    }, new BigNumber(0));
  }, [token, unspentCoins]);

  return (
    <View>
      <View style={[styled.container, maxSize === index && { marginBottom : 40 }]}>
        <View style={[styled.extra, styled.extraTop]}>
          <View style={{ flexDirection: 'row' }}>
            <NormalText text={token?.name} style={styled.boldText} />
            {(!!token?.isVerified) && <TokenVerifiedIcon />}
          </View>
          {loading ?
            (<ActivityIndicator />) :
            (
              <NormalText
                style={[styled.bottomText, styled.boldText]}
                text={`${unspentCoins.length} UTXOS`}
              />
            )}
        </View>
        <View style={styled.extra}>
          {
            !loading && (
              <Text style={[styled.rightText, balanceStyled.pSymbol, { fontFamily: FONT.NAME.medium }]}>
                {`${formatUtils.amountFull(balance.toString(), token.pDecimals)} ${token.symbol}`}
              </Text>
            )
          }
        </View>
      </View>
    </View>
  );
});

const ConvertTokenList = React.memo(({ onNavigateToConvert, onPullRefresh }) => {
  const { coins, isFetching, hasUnspentCoins, isRefreshing } = useSelector(convertCoinsDataSelector);

  const renderItem = (data) => <Item item={data?.item} index={data?.index} maxSize={coins.length - 1} loading={isRefreshing} />;

  const renderButton = () => {
    if (!hasUnspentCoins || isRefreshing) return null;
    return(
      <View style={{ marginBottom: 20 }}>
        <ButtonBasic
          title="Go to convert screen"
          disabled={!hasUnspentCoins}
          onPress={onNavigateToConvert}
        />
      </View>
    );
  };

  const renderEmptyView = () => (
    <View style={styles.container}>
      <Image source={noTransaction} style={styles.image} />
      <Text style={styles.text}>
        {'Shield some coins to start\ntransacting anonymously.'}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isFetching && !isRefreshing) return <LoadingContainer />;
    if (isEmpty(coins)) return renderEmptyView();
    return (
      <>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onPullRefresh} />
          }
          data={coins}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.tokenID}
          style={{ paddingTop: 10 }}
        />
        {renderButton()}
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Convert Coins" accountSelectable />
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
    </View>
  );
});

ConvertTokenList.propTypes = {
  onNavigateToConvert: PropTypes.func.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  maxSize: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  withLayout_2,
  enhance
)(ConvertTokenList);
