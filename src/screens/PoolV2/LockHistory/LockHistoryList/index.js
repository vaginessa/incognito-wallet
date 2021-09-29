/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'recompose';
import { View, Text, TouchableOpacity } from '@components/core';
import { Row, PRVSymbol } from '@src/components/';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import withHistories from '@screens/PoolV2/histories.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import mainStyles from '@screens/PoolV2/style';
import withData from './data.enhance';
import styles from './style';

const LockHistory = ({
  coin,
  lockHistories,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Header title="Provide PRV lock history" onGoBack={() => navigation.navigate(ROUTE_NAMES.PoolV2)} />
      {lockHistories.map((item) => {
        return (
          <TouchableOpacity key={item}>
            <View style={mainStyles.coin} key={item.symbol}>
              <Row>
                <View>
                  <Text style={mainStyles.coinName}>{item.displayBalance} {item.symbol} </Text>
                  <Row>
                    <PRVSymbol style={mainStyles.coinInterest} />
                    <Text style={[mainStyles.coinExtra, mainStyles.coinInterest]}>
                      &nbsp;{item.displayReward}
                    </Text>
                  </Row>
                </View>

                <View style={[mainStyles.flex]}>
                  <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                    {item.displayUnlockDate}
                  </Text>
                </View>
              </Row>
            </View>
          </TouchableOpacity>
          
        );
      })}
    </View>
  );
};

LockHistory.propTypes = {
  coin: PropTypes.object,
  lockHistories: PropTypes.array,
};

LockHistory.defaultProps = {
  coin: null,
  lockHistories: [],
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withData,
  withHistories,
)(LockHistory);
