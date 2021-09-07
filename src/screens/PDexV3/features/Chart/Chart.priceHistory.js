import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryLine } from 'victory-native';
import { COLORS, FONT } from '@src/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from '@src/components';
import { ButtonBasic } from '@src/components/Button';
import { screenSize } from '@src/styles/TextStyle';
import { priceHistorySelector } from './Chart.selector';
import { actionChangePeriod, actionFetchPriceHistory } from './Chart.actions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
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

const periods = ['15m', '1h', '4h', '1d', '1w', '1m', '1y'];

const Period = React.memo((props) => {
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
      {periods.map((period) => (
        <ButtonBasic
          btnStyle={styled.btnStyle}
          titleStyle={{
            ...styled.titleStyle,
            ...(period === actived ? { color: COLORS.colorTradeBlue } : {}),
          }}
          title={period}
          key={period}
          onPress={async () => {
            if(actived === period){
              return;
            }
            await dispatch(actionChangePeriod(period));
            await dispatch(actionFetchPriceHistory());
          }}
        />
      ))}
    </Row>
  );
});

const PriceHistory = (props) => {
  const { data, yMaxDomain, yMinDomain = 0 } = useSelector(
    priceHistorySelector,
  );
  if (data.length === 0) {
    return null;
  }
  return (
    <View style={styled.container}>
      <VictoryLine
        padding={0}
        width={screenSize.width - 50}
        height={200}
        // containerComponent={
        //   <VictoryVoronoiContainer
        //     labels
        //     labelComponent={
        //       <VictoryTooltip
        //         text={({ datum }) => `$${datum.y}`}
        //         style={{
        //           fill: COLORS.black,
        //           fontSize: FONT.SIZE.medium,
        //         }}
        //         flyoutStyle={{
        //           stroke: 'transparent',
        //           fill: COLORS.lightGrey19,
        //         }}
        //         flyoutPadding={5}
        //       />
        //     }
        //   />
        // }
        style={{
          data: {
            stroke: COLORS.colorTradeBlue,
            strokeWidth: 3,
          },
        }}
        data={data}
      />
      <Period />
    </View>
  );
};

PriceHistory.propTypes = {};

export default React.memo(PriceHistory);
