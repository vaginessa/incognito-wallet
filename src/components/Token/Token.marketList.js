import React, {memo} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {ListView} from '@components/Token/index';
import {BtnChecked} from '@components/Button';
import {COLORS, FONT} from '@src/styles';
import {useDispatch} from 'react-redux';
import {getPTokenList} from '@src/redux/actions/token';

const styled = StyleSheet.create({
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  hookText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.black,
    marginLeft: 5,
  },
});

const MarketList = (props) => {
  const {
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
    renderItem,
    keySearch,
  } = props;
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const onRefresh = async () => {
    try {
      setLoading(true);
      await dispatch(getPTokenList);
      setLoading(false);
    } catch (e) {
      console.log('MarketList: error', );
      setLoading(false);
    }
  };

  const AlList = React.useMemo(() => {
    return (
      <>
        <ListView {...tokensFactories[0]} renderItem={renderItem} />
        <BtnChecked
          btnStyle={[
            styled.hook,
          tokensFactories[9]?.visible ? null : { marginBottom: 50 },
          ]}
          onPress={onToggleUnVerifiedTokens}
          checked={toggleUnVerified}
          hook={<Text style={styled.hookText}>Show unverified coins</Text>}
        />
        <ListView {...tokensFactories[1]} renderItem={renderItem} />
      </>
    );
  }, [toggleUnVerified, tokensFactories]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {!keySearch && (
        <ListView {...tokensFactories[2]} renderItem={renderItem} />
      )}
      {!!keySearch && (
        AlList
      )}
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
};

export default memo(MarketList);
