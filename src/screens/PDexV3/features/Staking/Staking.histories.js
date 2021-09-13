import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {Text, TouchableOpacity} from '@components/core';
import styles from '@screens/PoolV2/History/HistoryList/style';
import {ArrowRightGreyIcon} from '@components/Icons';
import {historyStyle as historyStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {useSelector} from 'react-redux';
import {
  stakingHistoriesMapperSelector,
  stakingHistoriesStatus
} from '@screens/PDexV3/features/Staking/Staking.selector';
import {useNavigation} from 'react-navigation-hooks';
import withHistories from '@screens/PDexV3/features/Staking/Staking.enhanceHistories';
import routeNames from '@routers/routeNames';

const HistoryItem = React.memo(({ item, head, onNavigation }) => (
  <TouchableOpacity
    key={item.id}
    style={[styles.historyItem, head && historyStyled.historyTitle]}
    onPress={() => onNavigation(item)}
  >
    <Text style={historyStyled.buttonTitle}>{item.typeStr}</Text>
    <View style={historyStyled.row}>
      <Text style={[historyStyled.content, historyStyled.ellipsis]} numberOfLines={1}>{item.amountSymbolStr}</Text>
      <View style={[historyStyled.row, historyStyled.center, historyStyled.status]}>
        <Text style={[historyStyled.content]} numberOfLines={1}>{item.statusStr}</Text>
        <ArrowRightGreyIcon style={{ marginLeft: 10 }} />
      </View>
    </View>
  </TouchableOpacity>
));

const StakingHistories = ({ onFetchHistories }) => {
  const histories = useSelector(stakingHistoriesMapperSelector);
  const { isFetching } = useSelector(stakingHistoriesStatus);
  const navigation = useNavigation();
  const navigateHistoryDetail = (data) => navigation.navigate(routeNames.StakingHistoryDetail, { data });
  const renderHistoryItem = ({ item, index }) => <HistoryItem item={item} head={index === 0} onNavigation={navigateHistoryDetail} />;
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.histories} />
      <View style={historyStyled.wrapper}>
        <FlatList
          data={histories}
          refreshing={isFetching}
          onRefresh={() => {
            if (typeof onFetchHistories === 'function') {
              onFetchHistories();
            }
          }}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

HistoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  head: PropTypes.bool.isRequired,
  onNavigation: PropTypes.func.isRequired,
};

StakingHistories.propTypes = {
  onFetchHistories: PropTypes.func.isRequired,
};

export default withHistories(memo(StakingHistories));
