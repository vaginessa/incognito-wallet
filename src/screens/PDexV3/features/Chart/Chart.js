import React from 'react';
import { View } from 'react-native';
import {
  VictoryCandlestick,
  VictoryChart,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLine,
  VictoryLabel,
  VictoryAxis,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryScatter,
} from 'victory-native';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import random from 'lodash/random';
import { COLORS } from '@src/styles';
import { camelCaseKeys } from '@src/utils';
import _, { floor } from 'lodash';
import format from '@src/utils/format';
import { styled } from './Chart.styled';

const sampleData = [
  { open: 5, close: 10, high: 15, low: 3 },
  { open: 10, close: 15, high: 20, low: 5 },
  { open: 15, close: 20, high: 22, low: 10 },
  { open: 20, close: 10, high: 25, low: 7 },
  { open: 10, close: 8, high: 15, low: 8 },
];

const Chart = () => {
  const [zoomDomain, setZoomDomain] = React.useState();
  const getData = React.useCallback(() => {
    let from, to, min, max;
    const now = new Date();
    const data = [...Array(10)].map((item, index, arr) => {
      const size = arr.length;
      let before15m = new Date();
      before15m.setDate(now.getDate() - 1 * index);
      const indexTo = floor(size / 4);
      const indexFrom = floor(size - 1 - size / 4);
      if (index === 0) {
        max = new Date();
      }
      if (index === size - 1) {
        min = before15m;
      }
      if (index === indexTo) {
        console.log('indexTo', indexTo);
        to = before15m;
      }
      if (index === indexFrom) {
        console.log('dindexFrom', indexFrom);
        from = before15m;
      }
      const randIndex = random(0, sampleData.length - 1);
      return {
        x: before15m,
        ...sampleData[randIndex],
      };
    });
    const dataDate = React.useMemo(() => data.map(({ x }) => x), []);
    return {
      data,
      dataDate,
      from,
      to,
      min,
      max,
    };
  }, []);
  const { data, dataDate, from, to, min, max } = getData();
  console.log(
    'data',
    `from: ${format.formatDateTime(from, 'DD-MM-YYYY hh:mm A')}`,
    `to: ${format.formatDateTime(to, 'DD-MM-YYYY hh:mm A')}`,
    `min: ${format.formatDateTime(min, 'DD-MM-YYYY hh:mm A')}`,
    `max: ${format.formatDateTime(max, 'DD-MM-YYYY hh:mm A')}`,
  );
  const getScatterData = React.useCallback(() => {
    return _.range(100).map((index) => {
      return {
        x: random(1, 50),
        y: random(10, 90),
        size: random(8) + 3,
      };
    });
  }, []);
  // React.useEffect(() => {}, []);
  // if (!zoomDomain) {
  //   return null;
  // }
  return (
    <View style={styled.container}>
      <Header title="Chart" />
      <VictoryChart
        domainPadding={{ x: 20 }}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        // domain={{
        //   y: [0, 35],
        // }}
        containerComponent={
          <VictoryZoomContainer
            zoomDomain={{
              x: [from, to],
              // y: [0, 35],
            }}
            onZoomDomainChange={(domain, props) => {
              const { x } = domain;
              const [a, b] = x;
              // console.log('a', a, 'b', b);
              // console.log(
              //   format.formatDateTime(a, 'DD-MM-YYYY hh:mm A'),
              //   format.formatDateTime(b, 'DD-MM-YYYY hh:mm A'),
              // );
            }}
            allowPan
            allowZoom
            zoomDimension="x"
            // downsample={10}
          />
        }
      >
        <VictoryCandlestick
          candleColors={{ positive: COLORS.green, negative: COLORS.red }}
          data={data}
        />
      </VictoryChart>
      <VictoryChart
        domain={{ y: [0, 100] }}
        containerComponent={
          <VictoryZoomContainer zoomDomain={{ x: [5, 35], y: [0, 100] }} />
        }
      >
        <VictoryScatter
          data={getScatterData()}
          style={{
            data: {
              opacity: ({ datum }) => (datum.y % 5 === 0 ? 1 : 0.7),
              fill: ({ datum }) => (datum.y % 5 === 0 ? 'tomato' : 'black'),
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

Chart.propTypes = {};

export default withLayout_2(React.memo(Chart));
