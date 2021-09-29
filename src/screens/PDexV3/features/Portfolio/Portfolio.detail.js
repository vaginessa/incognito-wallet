import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  SafeAreaView
} from 'react-native';
import {COLORS} from '@src/styles';
import {batch, useDispatch, useSelector} from 'react-redux';
import {getDataShareByPoolIdSelector, modalDataSelector} from '@screens/PDexV3/features/Portfolio/Portfolio.selector';
import {actionFreeModal} from '@screens/PDexV3/features/Portfolio/Portfolio.actions';
import Modal from 'react-native-modal';
import {Hook} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail';
import TextStyle, {FontStyle} from '@src/styles/TextStyle';
import {ButtonTrade, ButtonTrade1} from '@components/Button';
import {liquidityActions} from '@screens/PDexV3/features/Liquidity';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {Row} from '@src/components';
import {portfolioItemStyled as styled} from '@screens/PDexV3/features/Portfolio/Portfolio.styled';

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: COLORS.white,
    height: '60%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  title: {
    lineHeight: 60,
    ...TextStyle.bigText,
    ...FontStyle.bold,
    color: '#101111',
  },
  btnText: {
    color: COLORS.lightGrey31,
    fontSize: 14
  },
  btnSmall: {
    height: 28,
    width: 89,
    marginLeft: 5,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

const PortfolioModal = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { visible, poolId } = useSelector(modalDataSelector);
  const data = useSelector(getDataShareByPoolIdSelector)(poolId);
  const onClose = () => dispatch(actionFreeModal());
  const onWithdrawPress = () => {
    batch(() => {
      onClose();
      dispatch(liquidityActions.actionSetRemovePoolToken({ inputToken: token1.tokenId, outputToken: token2.tokenId }));
      dispatch(liquidityActions.actionSetRemovePoolID(poolId));
      navigation.navigate(routeNames.RemovePool);
    });
  };
  const onInvestPress = () => {
    batch(() => {
      onClose();
      dispatch(liquidityActions.actionSetContributePoolID({ poolId }));
      navigation.navigate(routeNames.ContributePool);
    });
  };
  if (!data) return null;
  const { hookFactoriesDetail, token1, token2 } = data || {};

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.view}
    >
      <View style={styles.content}>
        <Row style={styles.row}>
          <Text style={styles.title}>{`${token1.symbol} / ${token2.symbol}`}</Text>
          <ButtonTrade1
            title="Withdraw"
            titleStyle={styles.btnText}
            btnStyle={styles.btnSmall}
            onPress={onWithdrawPress}
          />
        </Row>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {hookFactoriesDetail.map((hook) => (
            <Hook key={hook?.label} {...hook} />
          ))}
        </ScrollView>
        <SafeAreaView>
          <ButtonTrade
            title="Invest more"
            onPress={onInvestPress}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default memo(PortfolioModal);
