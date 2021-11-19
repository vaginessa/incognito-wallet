import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import Row from '@src/components/Row';
import { Text, TouchableOpacity } from '@src/components/core';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  btnContainer: {
    marginRight: 15,
  },
  percent: {
    fontSize: FONT.SIZE.superSmall,
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    textAlign: 'center',
  },
  percentBtn: {
    height: 8,
    borderRadius: 20,
    width: '100%',
    marginBottom: 10,
  },
  btnLastChild: {
    marginRight: 0,
  },
});

const SelectPercentAmount = (props) => {
  const { selected, onPressPercent, lastPercent } = props;
  const {
    size = 4,
    percentBtnColor = COLORS.colorTradeBlue,
    containerStyled,
  } = props;
  const renderMain = () => {
    return [...Array(size)].map((item, index, arr) => {
      const percent = (((index + 1) / size) * 100).toFixed(0);
      const lastChild = index === arr.length - 1;
      const isFilled = Number(percent) <= Number(selected);
      const percentStr = `${percent}%`;
      return (
        <TouchableOpacity
          style={[
            {
              flex: index + 1,
            },
            styled.btnContainer,
            lastChild && styled.btnLastChild,
          ]}
          onPress={() => onPressPercent(percent)}
          key={percent}
        >
          <View
            style={[
              styled.percentBtn,
              {
                backgroundColor: isFilled
                  ? percentBtnColor
                  : COLORS.colorGrey2,
              },
            ]}
          />
          <Text
            style={{
              ...styled.percent,
              ...(isFilled ? { fontFamily: FONT.NAME.medium } : {}),
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lastChild ? lastPercent || percentStr : percentStr}
          </Text>
        </TouchableOpacity>
      );
    });
  };
  return <Row style={[styled.container, containerStyled]}>{renderMain()}</Row>;
};

SelectPercentAmount.propTypes = {
  size: PropTypes.number.isRequired,
  percentBtnColor: PropTypes.string.isRequired,
  containerStyled: PropTypes.any,
  selected: PropTypes.number.isRequired,
  onPressPercent: PropTypes.func.isRequired,
  lastPercent: PropTypes.string,
};

export default React.memo(SelectPercentAmount);
