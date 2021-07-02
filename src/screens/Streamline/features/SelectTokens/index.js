import React from 'react';
import {FlatList, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {Header, LoadingContainer} from '@src/components';
import {useDispatch, useSelector} from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import {streamlineConsolidateSelector, useStreamLine} from '@screens/Streamline';
import BigNumber from 'bignumber.js';
import {ActivityIndicator, TouchableOpacity} from '@components/core';
import { styled } from '@components/Token/Token.styled';
import { NormalText } from '@components/Token/Token';
import { TokenVerifiedIcon } from '@components/Icons';
import formatUtils from '@utils/format';
import { balanceStyled } from '@screens/Wallet/features/Detail/Detail.styled';
import { FONT } from '@src/styles';
import { MAX_NO_INPUT_DEFRAGMENT } from '@screens/Streamline/Streamline.constant';
import isEmpty from 'lodash/isEmpty';
import withDetectUTXOS from '@screens/Streamline/Streamline.detectUTXOS';

const Item = React.memo(({ item, maxSize, index, loading, onPress }) => {
  const { tokenID, unspentCoins } = item;
  const token = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(tokenID);
  const balance = React.useMemo(() => {
    return unspentCoins.reduce((prev, coin) => {
      return prev.plus(coin.Value);
    }, new BigNumber(0));
  }, [token, unspentCoins]);

  const disabled = unspentCoins.length < MAX_NO_INPUT_DEFRAGMENT || loading;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      onPress={() => {
        if (typeof onPress !== 'function') return;
        onPress(tokenID);
      }}
    >
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
          <Text style={[styled.rightText, balanceStyled.pSymbol, { fontFamily: FONT.NAME.medium }]}>
            {`${formatUtils.amountFull(balance.toString(), token.pDecimals)} ${token.symbol}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SelectToken = React.memo(({ onSelectItem }) => {
  const { UTXOSFiltered: UTXOS } = useSelector(streamlineConsolidateSelector);
  const loading = isEmpty(UTXOS);
  const renderItem = (data) => <Item item={data?.item} index={data?.index} maxSize={UTXOS.length - 1} loading={loading} onPress={onSelectItem} />;
  return (
    <View style={{ marginHorizontal: 25, flex: 1 }}>
      <Header title="Consolidate" accountSelectable />
      {isEmpty(UTXOS) ?
        (<LoadingContainer />) : (
          <FlatList
            data={UTXOS}
            renderItem={renderItem}
            keyExtractor={item => item.tokenID}
            style={{ paddingTop: 30 }}
            showsVerticalScrollIndicator={false}
          />
        )}
    </View>
  );
});

SelectToken.propTypes = {
  onSelectItem: PropTypes.func.isRequired,
};
Item.propTypes = {
  item: PropTypes.object.isRequired,
  maxSize: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default withDetectUTXOS(SelectToken);
