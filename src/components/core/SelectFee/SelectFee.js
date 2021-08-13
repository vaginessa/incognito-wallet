import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  symbol: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.newGrey,
    textAlign: 'right',
    marginRight: 10,
  },
  tail: {
    marginRight: 0,
  },
  isActived: {
    color: COLORS.black,
  },
});

const SelectFeeItem = (props) => {
  const { symbol, tokenId, isActived, tail, ...rest } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.feeItem, tail ? styled.tail : null]}>
        <Text
          style={[
            styled.symbol,
            tail && styled.tail,
            isActived ? styled.isActived : null,
          ]}
        >
          {symbol}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const SelectFee = (props) => {
  const { types = [], onChangeTypeFee } = props;
  const [actived, setActived] = React.useState(null);
  const onChangeFee = (type) => {
    const { tokenId, symbol } = type;
    if (tokenId === actived) {
      return;
    }
    setActived(tokenId);
    if (typeof onChangeTypeFee === 'function') {
      onChangeTypeFee(type);
    }
  };
  React.useEffect(() => {
    setActived(types[0]?.tokenId);
  }, []);
  return (
    <Row style={styled.container}>
      {types.map((type, index) => (
        <SelectFeeItem
          key={type?.tokenId}
          {...{
            ...type,
            isActived: actived === type?.tokenId,
            tail: index === types.length - 1,
            onPress: () => onChangeFee(type),
          }}
        />
      ))}
    </Row>
  );
};

SelectFee.propTypes = {
  onChangeTypeFee: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default React.memo(SelectFee);
