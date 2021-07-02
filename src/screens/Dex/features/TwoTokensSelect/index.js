import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import styles from '@components/TokenSelectScreen/style';
import BackButton from '@components/BackButtonV2';
import {BaseTextInput} from '@components/core';
import VerifiedText from '@components/VerifiedText';
import {COLORS} from '@src/styles';
import { toLower, uniqBy, trim } from 'lodash';

const TwoTokensSelect = () => {
  const tokens = useNavigationParam('tokens') || [];
  const placeholder = useNavigationParam('placeholder') || 'Search coins';
  const onSelectToken = useNavigationParam('onSelectToken');
  const [displayTokens, setDisplayTokens] = React.useState(tokens);
  const navigation = useNavigation();

  const handleSearch = text => {
    if (text) {
      const searchText = toLower(trim(text));
      const validTokens = uniqBy(tokens, 'id').filter(
        item =>
          toLower(item.name).includes(searchText) ||
          toLower(item.symbol).includes(searchText) ||
          toLower(item?.tokenID).includes(searchText) ||
          toLower(item?.contractId).includes(searchText),
      );

      setDisplayTokens(validTokens);
    } else {
      setDisplayTokens(tokens);
    }
  };

  const handleSelectToken = (token) => {
    if (typeof onSelectToken !== 'function') return;

    onSelectToken(token.outputToken, token.inputToken);
    navigation.goBack();
  };

  const renderItem = (data) => {
    const { item } = data;
    const { inputToken: token1, outputToken: token2, shareFee } = item;
    const { symbol: symbol1, displaySymbol: displaySymbol1, verified1, isVerified1, name: tokenName1 } = token1;
    const { symbol: symbol2, displaySymbol: displaySymbol2, verified2, isVerified2, name: tokenName2 } = token2;
    return(
      <TouchableOpacity onPress={() => handleSelectToken(item)}>
        <View style={{ flexDirection: 'row' }}>
          <VerifiedText text={tokenName1} isVerified={verified1 || isVerified1} style={styles.tokenName} />
          <VerifiedText text="-" style={styles.tokenName} />
          <VerifiedText text={tokenName2} isVerified={verified2 || isVerified2} style={styles.tokenName} />
        </View>
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.networkName}>
            {`${symbol1 || displaySymbol1}-${symbol2 || displaySymbol2}`}
          </Text>
          <Text style={[styles.networkName, { color: COLORS.black, fontSize: 18 }]}>
            {shareFee}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { marginHorizontal: 25, flex: 1 }]}>
      <View style={[styles.row]}>
        <BackButton />
        <BaseTextInput
          placeholder={placeholder}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>
      <FlatList
        data={displayTokens}
        renderItem={renderItem}
      />
    </View>
  );
};

TwoTokensSelect.propTypes = {

};


export default React.memo(TwoTokensSelect);
