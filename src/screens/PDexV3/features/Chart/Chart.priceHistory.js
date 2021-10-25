import React from 'react';
import format from '@src/utils/format';
import { View, StyleSheet } from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { COLORS, FONT } from '@src/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { ButtonBasic } from '@src/components/Button';
import { ActivityIndicator } from '@src/components/core';
import { priceHistorySelector } from './Chart.selector';
import { actionChangePeriod, actionFetchPriceHistory } from './Chart.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 24,
  },
  chart: {
    height: 200,
    width: '100%',
  },
  btnStyle: {
    minWidth: 40,
    height: 24,
    backgroundColor: COLORS.lightGrey19,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
    color: COLORS.black,
  },
});

const periods = ['15m', '1h', '4h', '1d', 'W', 'M', 'Y'];

const Period = React.memo(() => {
  const dispatch = useDispatch();
  const { period: actived } = useSelector(priceHistorySelector);
  return (
    <Row
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
      }}
    >
      {periods?.map((period) => (
        <ButtonBasic
          btnStyle={styled.btnStyle}
          titleStyle={{
            ...styled.titleStyle,
            ...(period === actived ? { color: COLORS.colorTradeBlue } : {}),
          }}
          title={period}
          key={period}
          onPress={async () => {
            if (actived === period) {
              return;
            }
            await dispatch(actionChangePeriod(period));
            dispatch(actionFetchPriceHistory());
          }}
        />
      ))}
    </Row>
  );
});

const PriceHistory = () => {
  const { history, fetching, period } = useSelector(priceHistorySelector);
  const dispatch = useDispatch();
  const handleFetchData = React.useCallback(
    () => dispatch(actionFetchPriceHistory()),
    [],
  );
  React.useEffect(() => {
    handleFetchData();
  }, []);
  return (
    <View style={styled.container}>
      {fetching && <ActivityIndicator />}
      {history.length > 0 ? (
        <VictoryChart
          scale={{
            x: 'time',
            y: 'linear',
          }}
          containerComponent={
            <VictoryVoronoiContainer labels={({ datum }) => datum.y} />
          }
          padding={{ top: 60, bottom: 30, left: 0, right: 0 }}
        >
          <VictoryLine
            labelComponent={<VictoryTooltip />}
            height={200}
            style={{
              data: {
                stroke: COLORS.colorTradeBlue,
                strokeWidth: 3,
              },
            }}
            data={history}
          />
          <VictoryAxis
            tickValues={history.map((h) => h.x)}
            tickFormat={(x, index, arr) => {
              if (index % 2 !== 0 || index === arr.length - 1) {
                return '';
              }
              switch (period) {
              case '15m':
                return format.formatDateTime(x, 'HH:mm');
              case '1h':
                return format.formatDateTime(x, 'HH:mm');
              case '4h':
                return format.formatDateTime(x, 'HH:mm');
              case '1d':
                return format.formatDateTime(x, 'DD/MM');
              case 'W':
                return format.formatDateTime(x, 'DD/MM');
              case 'M':
                return format.formatDateTime(x, 'MM/YY');
              case 'Y':
                return format.formatDateTime(x, 'YYYY');
              default:
                return format.formatDateTime(x, '');
              }
            }}
          />
        </VictoryChart>
      ) : (
        <View style={styled.chart} />
      )}
      <Period />
    </View>
  );
};

PriceHistory.propTypes = {};

export default React.memo(PriceHistory);
