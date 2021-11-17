import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {ListView} from '@components/Token/index';
import {KeyboardAwareScrollView} from '@components/core';
import {BtnChecked} from '@components/Button';
import {COLORS, FONT} from '@src/styles';

const MarketList = (props) => {
  const {
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
    renderItem,
    keySearch,
    tokensMarket
  } = props;

  // const AlList = React.useMemo(() => {
  //   return (
  //     <>
  //       <ListView visible={keySearch} {...tokensFactories[0]} renderItem={renderItem} />
  //       <BtnChecked
  //         btnStyle={[
  //           styled.hook,
  //         tokensFactories[1]?.visible ? null : { marginBottom: 50 },
  //         ]}
  //         onPress={onToggleUnVerifiedTokens}
  //         checked={toggleUnVerified}
  //         hook={<Text style={styled.hookText}>Show unverified coins</Text>}
  //       />
  //       <ListView visible={keySearch} {...tokensFactories[1]} renderItem={renderItem} />
  //     </>
  //   );
  // }, [keySearch, toggleUnVerified, tokensFactories]);


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <ListView {...tokensFactories[2]} renderItem={renderItem} />
    </ScrollView>
  );
};

MarketList.defaultProps = {
  keySearch: ''
};

MarketList.propTypes = {
  tokensFactories: PropTypes.array.isRequired,
  onToggleUnVerifiedTokens: PropTypes.func.isRequired,
  toggleUnVerified: PropTypes.bool.isRequired,
  renderItem: PropTypes.func.isRequired,
  keySearch: PropTypes.string,
  tokensMarket: PropTypes.array.isRequired
};

export default memo(MarketList);
