import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {useNavigationParam} from 'react-navigation-hooks';
import flatten from 'lodash/flatten';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';

const ContributeDetail = () => {
  const history = useNavigationParam('history');
  const handleOpenLink = (txID) => {
    if (!txID) return;
    linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,);
  };
  const hookFactories = React.useMemo(() => {
    const { pairId, poolId, statusStr, contributes, storageValue, timeStr } = history;
    const headHook = [
      {
        label: 'PoolId',
        valueText: poolId,
        copyable: true,
        disabled: !poolId,
      },
      {
        label: 'PairId',
        valueText: pairId,
        disabled: !pairId,
        copyable: true,
      },
      {
        label: 'Status',
        valueText: statusStr,
      },
      {
        label: 'Time',
        valueText: timeStr,
      },
    ];
    const contributeHook = [...contributes, ...storageValue].map((item, index) => {
      index += 1;
      return [
        {
          label: `TxID${index}`,
          valueText: item.requestTx,
          copyable: true,
          openUrl: true,
          handleOpenLink: () => {
            handleOpenLink(item.requestTx);
          }
        },
        {
          label: `Amount${index}`,
          valueText: item.contributeAmountSymbolStr,
        },
      ];
    });
    return [...headHook, ...flatten(contributeHook)];
  }, [history]);
  return (
    <View style={mainStyle.container}>
      <Header title="Detail" />
      <ScrollView>
        {hookFactories.map(data => <Hook key={data?.label} {...data} />)}
      </ScrollView>
    </View>
  );
};

ContributeDetail.propTypes = {};

export default memo(ContributeDetail);
