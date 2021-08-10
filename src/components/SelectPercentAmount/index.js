import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import Row from '../Row';
import { Text, TouchableOpacity } from '../core';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    marginRight: 10,
  },
  percent: {
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 4,
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    textAlign: 'center',
  },
  percentBtn: {
    height: 10,
    borderRadius: 20,
    width: '100%',
    marginBottom: 10,
  },
});

const SelectPercentAmount = (props) => {
  const [selected, setSelected] = React.useState(0);
  const {
    size = 4,
    percentBtnColor = COLORS.colorTradeBlue,
    handleSelectPercent,
    containerStyled,
  } = props;
  const onPressPercent = (percent) => {
    let _percent;
    if (percent === selected) {
      _percent = 0;
      setSelected(0);
    } else {
      _percent = percent;
      setSelected(percent);
    }
    if (typeof handleSelectPercent === 'function') {
      handleSelectPercent(_percent);
    }
  };
  const renderMain = () => {
    return [...Array(size)].map((item, index) => {
      const percent = (((index + 1) / size) * 100).toFixed(0);
      const isFilled = Number(percent) <= Number(selected);
      return (
        <View key={percent} style={styled.btnContainer}>
          <TouchableOpacity
            style={[
              styled.percentBtn,
              {
                backgroundColor: isFilled
                  ? percentBtnColor
                  : COLORS.lightGrey18,
              },
            ]}
            onPress={() => onPressPercent(percent)}
          />
          <Text style={styled.percent}>{percent}%</Text>
        </View>
      );
    });
  };
  return <Row style={[styled.container, containerStyled]}>{renderMain()}</Row>;
};

SelectPercentAmount.propTypes = {
  size: PropTypes.number.isRequired,
  percentBtnColor: PropTypes.string.isRequired,
  handleSelectPercent: PropTypes.func.isRequired,
  containerStyled: PropTypes.any,
};

export default React.memo(SelectPercentAmount);
