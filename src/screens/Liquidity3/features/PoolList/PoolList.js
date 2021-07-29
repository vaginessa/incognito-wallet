import React from 'react';
import { FlatList, View } from 'react-native';
import { Row } from '@src/components';
import styled from '@screens/Liquidity3/features/PoolList/PoolList.styled';
import { FixedHeaderPoolCard, PoolCard } from '@screens/Liquidity3/components';
import { useSelector } from 'react-redux';
import {fetchingSelector, poolListSelector} from '@screens/Liquidity3/Liquidity3.selector';
import { v4 } from 'uuid';
import { MESSAGES } from '@screens/Liquidity3/Liquidity3.constants';
import enhance from '@screens/Liquidity3/features/PoolList/PoolList.enhance';
import PropTypes from 'prop-types';
import BackButton from '@components/BackButtonV2';
import { ActivityIndicator, BaseTextInput, RefreshControl } from '@components/core';
import styles from '@components/TokenSelectScreen/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import { COLORS } from '@src/styles';

const PoolList = React.memo(({
  onTextSearchChange,
  onItemPress,
  onPullRefresh,
  onBackPress
}) => {

  const data = useSelector(poolListSelector);
  const { isFetching, isRefreshing } = useSelector(fetchingSelector);

  const renderItem = (data) => <PoolCard data={data?.item} onPress={onItemPress} />;
  const renderKeyExtractor = (item) => item?.poolID || v4();
  const renderContent = () => (
    <>
      <FixedHeaderPoolCard />
      <FlatList
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullRefresh}
          />
        )}
        data={data}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </>
  );

  return (
    <View style={styled.container}>
      <Row>
        <BackButton onPress={onBackPress} />
        <BaseTextInput
          placeholder={MESSAGES.search_coin_input}
          onChangeText={onTextSearchChange}
          style={styles.input}
        />
      </Row>
      {isFetching ? (
        <View style={styled.wrapperLoading}>
          <ActivityIndicator size="small" color={COLORS.newGrey} />
        </View>
      ) : renderContent()}
    </View>
  );
});

PoolList.propTypes = {
  onTextSearchChange: PropTypes.func.isRequired,
  onItemPress: PropTypes.func.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
};

export default compose(
  withLayout_2,
  enhance,
)(PoolList);
